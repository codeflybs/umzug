from fastapi import APIRouter, Depends, HTTPException
from typing import List
from bson import ObjectId
from datetime import datetime

from models.service_category import ServiceCategory, ServiceCategoryCreate, ServiceCategoryUpdate
from .auth import get_current_user

router = APIRouter(prefix="/categories", tags=["Service Categories"])

from ..server import db

@router.get("", response_model=List[ServiceCategory])
async def list_categories(active_only: bool = True):
    """List all service categories"""
    query = {"active": True} if active_only else {}
    categories = await db.service_categories.find(query).to_list(100)
    
    for cat in categories:
        cat["_id"] = str(cat["_id"])
    
    return categories

@router.get("/{category_id}")
async def get_category(category_id: str):
    """Get category by ID or categoryId"""
    # Try to find by ObjectId first, then by categoryId
    try:
        category = await db.service_categories.find_one({"_id": ObjectId(category_id)})
    except:
        category = await db.service_categories.find_one({"categoryId": category_id})
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    category["_id"] = str(category["_id"])
    return category

@router.post("", response_model=ServiceCategory)
async def create_category(
    category: ServiceCategoryCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new service category (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Check if categoryId already exists
    existing = await db.service_categories.find_one({"categoryId": category.categoryId})
    if existing:
        raise HTTPException(status_code=400, detail="Category ID already exists")
    
    category_dict = category.dict()
    category_dict["createdAt"] = datetime.utcnow()
    category_dict["updatedAt"] = datetime.utcnow()
    
    result = await db.service_categories.insert_one(category_dict)
    category_dict["_id"] = str(result.inserted_id)
    
    return ServiceCategory(**category_dict)

@router.put("/{category_id}")
async def update_category(
    category_id: str,
    category: ServiceCategoryUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update service category (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    update_data = {k: v for k, v in category.dict(exclude_unset=True).items()}
    update_data["updatedAt"] = datetime.utcnow()
    
    try:
        result = await db.service_categories.update_one(
            {"_id": ObjectId(category_id)},
            {"$set": update_data}
        )
    except:
        result = await db.service_categories.update_one(
            {"categoryId": category_id},
            {"$set": update_data}
        )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category updated successfully"}

@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete service category (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        result = await db.service_categories.delete_one({"_id": ObjectId(category_id)})
    except:
        result = await db.service_categories.delete_one({"categoryId": category_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category deleted successfully"}
