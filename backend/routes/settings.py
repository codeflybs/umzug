from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Body
from typing import Optional
import os
import shutil
from datetime import datetime
from pathlib import Path

from models.company_settings import CompanySettings, Theme, TaxSettings, EmailSettings, Address
from .auth import get_current_user

router = APIRouter(prefix="/settings", tags=["Settings"])

from ..server import db

# Get upload directory path (same as server.py for consistency)
# This works in both Docker and local development
ROOT_DIR = Path(__file__).parent.parent
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Log upload directory for debugging
import logging
logger = logging.getLogger(__name__)
logger.info(f"Upload directory set to: {UPLOAD_DIR.absolute()}")

# Constants
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"]
ALLOWED_EXTENSIONS = [".png", ".jpeg", ".jpg", ".webp"]

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
    payload: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """Update company settings (admin only). Accepts a JSON body with keys like
    `companyName`, `addresses` and `defaultLanguage`.
    """
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    companyName = payload.get("companyName")
    addresses = payload.get("addresses")
    defaultLanguage = payload.get("defaultLanguage")

    update_data = {"updatedAt": datetime.utcnow()}

    # Only include keys which were provided (allow empty string as valid value)
    if companyName is not None:
        update_data["companyName"] = companyName
    if addresses is not None:
        update_data["addresses"] = addresses
    if defaultLanguage is not None:
        update_data["defaultLanguage"] = defaultLanguage

    result = await db.company_settings.update_one(
        {"_id": "company_settings"},
        {"$set": update_data}
    )

    # Use matched_count to detect missing document
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Settings not found")

    return {"message": "Settings updated successfully"}

@router.post("/logo")
async def upload_logo(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload company logo (admin only)
    
    - Accepts: PNG, JPEG, JPG, WEBP
    - Max size: 5MB
    - Returns: Logo URL
    """
    # Check admin permissions
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Validate file type
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_IMAGE_TYPES)}"
        )
    
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension. Allowed extensions: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    try:
        # Read file content to check size
        contents = await file.read()
        file_size = len(contents)
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE / (1024*1024):.1f}MB"
            )
        
        # Get current settings to find old logo
        current_settings = await db.company_settings.find_one({"_id": "company_settings"})
        old_logo = current_settings.get("logo") if current_settings else None
        
        # Generate unique filename
        timestamp = datetime.utcnow().timestamp()
        safe_filename = f"logo_{timestamp}{file_ext}"
        file_path = UPLOAD_DIR / safe_filename
        
        # Save new file
        logger.info(f"Saving logo to: {file_path.absolute()}")
        with open(str(file_path), "wb") as buffer:
            buffer.write(contents)
        
        logger.info(f"Logo file saved successfully: {safe_filename}")
        
        # Generate URL
        logo_url = f"/uploads/{safe_filename}"
        
        # Update database
        await db.company_settings.update_one(
            {"_id": "company_settings"},
            {"$set": {"logo": logo_url, "updatedAt": datetime.utcnow()}},
            upsert=True
        )
        
        # Delete old logo file if exists
        if old_logo and old_logo.startswith("/uploads/"):
            old_file_path = UPLOAD_DIR / os.path.basename(old_logo)
            if old_file_path.exists():
                try:
                    old_file_path.unlink()
                except Exception as e:
                    # Log but don't fail if old file can't be deleted
                    print(f"Warning: Could not delete old logo: {e}")
        
        return {
            "success": True,
            "message": "Logo uploaded successfully",
            "logo": logo_url
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload logo: {str(e)}"
        )

@router.delete("/logo")
async def delete_logo(current_user: dict = Depends(get_current_user)):
    """
    Delete company logo (admin only)
    
    - Removes logo file from disk
    - Resets logo field in database
    """
    # Check admin permissions
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        # Get current settings to find logo
        current_settings = await db.company_settings.find_one({"_id": "company_settings"})
        
        if not current_settings or not current_settings.get("logo"):
            raise HTTPException(status_code=404, detail="No logo found")
        
        logo_url = current_settings.get("logo")
        
        # Delete file if it exists
        if logo_url.startswith("/uploads/"):
            file_path = UPLOAD_DIR / os.path.basename(logo_url)
            if file_path.exists():
                file_path.unlink()
        
        # Update database to remove logo
        await db.company_settings.update_one(
            {"_id": "company_settings"},
            {"$set": {"logo": None, "updatedAt": datetime.utcnow()}}
        )
        
        return {
            "success": True,
            "message": "Logo deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete logo: {str(e)}"
        )

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
