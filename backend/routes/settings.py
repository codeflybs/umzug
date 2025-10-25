from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import Optional
import os
import shutil
from datetime import datetime

from models.company_settings import CompanySettings, Theme, TaxSettings, EmailSettings, Address
from .auth import get_current_user

router = APIRouter(prefix="/settings", tags=["Settings"])

from ..server import db

UPLOAD_DIR = "/app/backend/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/company")
async def get_company_settings():
    """Get company settings (public)"""
    settings = await db.company_settings.find_one({"_id": "company_settings"})
    
    if not settings:
        # Create default settings
        default_settings = CompanySettings(
            _id="company_settings",
            companyName="Gelbe-Umzüge",
            addresses=[Address(
                type="hauptsitz",
                street="Sandstrasse 5",
                city="Schönbühl",
                zipCode="3322",
                country="CH",
                phone="031 557 24 31",
                email="info@gelbe-umzuege.ch",
                website="www.gelbe-umzuege.ch"
            )]
        )
        await db.company_settings.insert_one(default_settings.dict(by_alias=True))
        settings = default_settings.dict(by_alias=True)
    
    # Remove sensitive email data for public access
    if "email" in settings:
        settings["email"] = {
            "fromEmail": settings["email"].get("fromEmail", ""),
            "fromName": settings["email"].get("fromName", "")
        }
    
    return settings

@router.put("/company")
async def update_company_settings(
    companyName: Optional[str] = None,
    addresses: Optional[list] = None,
    defaultLanguage: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Update company settings (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    update_data = {"updatedAt": datetime.utcnow()}
    
    if companyName:
        update_data["companyName"] = companyName
    if addresses:
        update_data["addresses"] = addresses
    if defaultLanguage:
        update_data["defaultLanguage"] = defaultLanguage
    
    result = await db.company_settings.update_one(
        {"_id": "company_settings"},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Settings not found")
    
    return {"message": "Settings updated successfully"}

@router.post("/logo")
async def upload_logo(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload company logo (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Validate file type
    allowed_types = ["image/png", "image/jpeg", "image/jpg", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    
    # Save file
    file_path = os.path.join(UPLOAD_DIR, f"logo_{datetime.utcnow().timestamp()}.{file.filename.split('.')[-1]}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update database
    logo_url = f"/uploads/{os.path.basename(file_path)}"
    await db.company_settings.update_one(
        {"_id": "company_settings"},
        {"$set": {"logo": logo_url, "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": "Logo uploaded successfully", "logoUrl": logo_url}

@router.put("/theme")
async def update_theme(
    theme: Theme,
    current_user: dict = Depends(get_current_user)
):
    """Update theme colors (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    await db.company_settings.update_one(
        {"_id": "company_settings"},
        {"$set": {"theme": theme.dict(), "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": "Theme updated successfully"}

@router.put("/tax")
async def update_tax_settings(
    tax: TaxSettings,
    current_user: dict = Depends(get_current_user)
):
    """Update tax settings (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    await db.company_settings.update_one(
        {"_id": "company_settings"},
        {"$set": {"tax": tax.dict(), "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": "Tax settings updated successfully"}

@router.put("/email")
async def update_email_settings(
    email: EmailSettings,
    current_user: dict = Depends(get_current_user)
):
    """Update email settings (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    await db.company_settings.update_one(
        {"_id": "company_settings"},
        {"$set": {"email": email.dict(), "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": "Email settings updated successfully"}
