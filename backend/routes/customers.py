from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from models.customer import Customer, CustomerCreate, CustomerUpdate
from .auth import get_current_user

router = APIRouter(prefix="/customers", tags=["Customers"])

from ..server import db

@router.get("/next-number")
async def get_next_customer_number(current_user: dict = Depends(get_current_user)):
    """Get next available customer number"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Find the highest customer number
    last_customer = await db.customers.find_one(sort=[("customerNumber", -1)])
    
    if last_customer:
        try:
            last_number = int(last_customer["customerNumber"])
            next_number = str(last_number + 1).zfill(5)
        except:
            next_number = "10001"
    else:
        next_number = "10001"
    
    return {"nextCustomerNumber": next_number}

@router.get("", response_model=List[Customer])
async def list_customers(
    active_only: bool = True,
    limit: int = Query(default=50, le=100),
    skip: int = 0,
    current_user: dict = Depends(get_current_user)
):
    """List customers (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    query = {"active": True} if active_only else {}
    customers = await db.customers.find(query).sort("createdAt", -1).skip(skip).limit(limit).to_list(limit)
    
    for customer in customers:
        customer["_id"] = str(customer["_id"])
    
    return customers

@router.get("/{customer_id}")
async def get_customer(customer_id: str, current_user: dict = Depends(get_current_user)):
    """Get customer by ID"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        customer = await db.customers.find_one({"_id": ObjectId(customer_id)})
    except:
        customer = await db.customers.find_one({"customerNumber": customer_id})
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    customer["_id"] = str(customer["_id"])
    return customer

@router.post("", response_model=Customer)
async def create_customer(
    customer: CustomerCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new customer (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Get next customer number
    next_number_response = await get_next_customer_number(current_user)
    customer_number = next_number_response["nextCustomerNumber"]
    
    customer_dict = customer.dict()
    customer_dict["customerNumber"] = customer_number
    customer_dict["createdBy"] = str(current_user["_id"])
    customer_dict["createdAt"] = datetime.utcnow()
    customer_dict["updatedAt"] = datetime.utcnow()
    customer_dict["active"] = True
    
    result = await db.customers.insert_one(customer_dict)
    customer_dict["_id"] = str(result.inserted_id)
    
    return Customer(**customer_dict)

@router.put("/{customer_id}")
async def update_customer(
    customer_id: str,
    customer: CustomerUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update customer (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    update_data = {k: v for k, v in customer.dict(exclude_unset=True).items()}
    update_data["updatedAt"] = datetime.utcnow()
    
    try:
        result = await db.customers.update_one(
            {"_id": ObjectId(customer_id)},
            {"$set": update_data}
        )
    except:
        raise HTTPException(status_code=400, detail="Invalid customer ID")
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    return {"message": "Customer updated successfully"}

@router.delete("/{customer_id}")
async def delete_customer(
    customer_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete customer (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        result = await db.customers.delete_one({"_id": ObjectId(customer_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid customer ID")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    return {"message": "Customer deleted successfully"}
