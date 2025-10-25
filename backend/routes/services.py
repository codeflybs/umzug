from fastapi import APIRouter, Depends, HTTPException
from typing import List
from bson import ObjectId
from datetime import datetime

from models.additional_service import AdditionalService, AdditionalServiceCreate, AdditionalServiceUpdate
from .auth import get_current_user

router = APIRouter(prefix="/services", tags=["Additional Services"])

from ..server import db

@router.get("", response_model=List[AdditionalService])
async def list_services(category_id: str = None, active_only: bool = True):
    """List all additional services"""
    query = {}
    if category_id:
        query["categoryId"] = category_id
    if active_only:
        query["active"] = True
    
    services = await db.additional_services.find(query).sort("order", 1).to_list(100)
    
    for service in services:
        service["_id"] = str(service["_id"])
    
    return services

@router.get("/{service_id}")
async def get_service(service_id: str):
    """Get service by ID"""
    try:
        service = await db.additional_services.find_one({"_id": ObjectId(service_id)})
    except:
        service = await db.additional_services.find_one({"serviceId": service_id})
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    service["_id"] = str(service["_id"])
    return service

@router.post("", response_model=AdditionalService)
async def create_service(
    service: AdditionalServiceCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new additional service (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Check if serviceId already exists
    existing = await db.additional_services.find_one({"serviceId": service.serviceId})
    if existing:
        raise HTTPException(status_code=400, detail="Service ID already exists")
    
    service_dict = service.dict()
    service_dict["createdAt"] = datetime.utcnow()
    service_dict["updatedAt"] = datetime.utcnow()
    
    result = await db.additional_services.insert_one(service_dict)
    service_dict["_id"] = str(result.inserted_id)
    
    return AdditionalService(**service_dict)

@router.put("/{service_id}")
async def update_service(
    service_id: str,
    service: AdditionalServiceUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update additional service (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    update_data = {k: v for k, v in service.dict(exclude_unset=True).items()}
    update_data["updatedAt"] = datetime.utcnow()
    
    try:
        result = await db.additional_services.update_one(
            {"_id": ObjectId(service_id)},
            {"$set": update_data}
        )
    except:
        result = await db.additional_services.update_one(
            {"serviceId": service_id},
            {"$set": update_data}
        )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return {"message": "Service updated successfully"}

@router.delete("/{service_id}")
async def delete_service(
    service_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete additional service (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        result = await db.additional_services.delete_one({"_id": ObjectId(service_id)})
    except:
        result = await db.additional_services.delete_one({"serviceId": service_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return {"message": "Service deleted successfully"}
