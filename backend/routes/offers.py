from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from models.offer import Offer, OfferCreate, OfferUpdate, Pricing
from .auth import get_current_user

router = APIRouter(prefix="/offers", tags=["Offers"])

from ..server import db

@router.get("", response_model=List[Offer])
async def list_offers(
    status: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = Query(default=50, le=100),
    skip: int = 0,
    current_user: dict = Depends(get_current_user)
):
    """List offers with filters"""
    query = {}
    if status:
        query["status"] = status
    if category:
        query["category"] = category
    
    offers = await db.offers.find(query).sort("createdAt", -1).skip(skip).limit(limit).to_list(limit)
    
    for offer in offers:
        offer["_id"] = str(offer["_id"])
    
    return offers

@router.get("/next-number")
async def get_next_offer_number(current_user: dict = Depends(get_current_user)):
    """Get next available offer number"""
    # Find the highest offer number
    last_offer = await db.offers.find_one(sort=[("offerNumber", -1)])
    
    if last_offer:
        try:
            last_number = int(last_offer["offerNumber"])
            next_number = str(last_number + 1).zfill(5)
        except:
            next_number = "10001"
    else:
        next_number = "10001"
    
    return {"nextOfferNumber": next_number}

@router.get("/{offer_id}")
async def get_offer(offer_id: str, current_user: dict = Depends(get_current_user)):
    """Get offer by ID"""
    try:
        offer = await db.offers.find_one({"_id": ObjectId(offer_id)})
    except:
        offer = await db.offers.find_one({"offerNumber": offer_id})
    
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    offer["_id"] = str(offer["_id"])
    return offer

@router.post("", response_model=Offer)
async def create_offer(
    offer: OfferCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new offer"""
    offer_dict = offer.dict()
    offer_dict["createdBy"] = str(current_user["_id"])
    offer_dict["createdAt"] = datetime.utcnow()
    offer_dict["updatedAt"] = datetime.utcnow()
    offer_dict["status"] = "draft"
    
    result = await db.offers.insert_one(offer_dict)
    offer_dict["_id"] = str(result.inserted_id)
    
    return Offer(**offer_dict)

@router.put("/{offer_id}")
async def update_offer(
    offer_id: str,
    offer: OfferUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update offer"""
    update_data = {k: v for k, v in offer.dict(exclude_unset=True).items()}
    update_data["updatedAt"] = datetime.utcnow()
    
    try:
        result = await db.offers.update_one(
            {"_id": ObjectId(offer_id)},
            {"$set": update_data}
        )
    except:
        raise HTTPException(status_code=400, detail="Invalid offer ID")
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    return {"message": "Offer updated successfully"}

@router.delete("/{offer_id}")
async def delete_offer(
    offer_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete offer"""
    try:
        result = await db.offers.delete_one({"_id": ObjectId(offer_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid offer ID")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    return {"message": "Offer deleted successfully"}

@router.post("/{offer_id}/calculate")
async def calculate_pricing(
    offer_id: str,
    base_price: float,
    additional_services: List[dict],
    discount: float = 0,
    discount_type: str = "percentage",
    current_user: dict = Depends(get_current_user)
):
    """Calculate offer pricing"""
    # Get tax settings
    settings = await db.company_settings.find_one({"_id": "company_settings"})
    tax_rate = settings.get("tax", {}).get("rate", 7.7) if settings else 7.7
    tax_enabled = settings.get("tax", {}).get("enabled", True) if settings else True
    
    # Calculate additional services total
    additional_total = sum(service.get("price", 0) for service in additional_services if service.get("selected", False))
    
    # Calculate subtotal
    subtotal = base_price + additional_total
    
    # Apply discount
    discount_amount = 0
    if discount > 0:
        if discount_type == "percentage":
            discount_amount = subtotal * (discount / 100)
        else:
            discount_amount = discount
    
    subtotal_after_discount = subtotal - discount_amount
    
    # Calculate tax
    tax_amount = 0
    if tax_enabled:
        tax_amount = subtotal_after_discount * (tax_rate / 100)
    
    total = subtotal_after_discount + tax_amount
    
    pricing = Pricing(
        basePrice=base_price,
        additionalServicesTotal=additional_total,
        subtotal=subtotal,
        discount=discount,
        discountType=discount_type,
        taxRate=tax_rate,
        taxAmount=tax_amount,
        total=total,
        currency="CHF",
        includeTax=tax_enabled
    )
    
    # Update offer with new pricing
    await db.offers.update_one(
        {"_id": ObjectId(offer_id)},
        {"$set": {"pricing": pricing.dict(), "updatedAt": datetime.utcnow()}}
    )
    
    return pricing

@router.post("/{offer_id}/send-email")
async def send_offer_email(
    offer_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Send offer via email (placeholder)"""
    # This will be implemented in Phase 4
    offer = await db.offers.find_one({"_id": ObjectId(offer_id)})
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    # Update email sent status
    await db.offers.update_one(
        {"_id": ObjectId(offer_id)},
        {"$set": {"emailSent": True, "emailSentAt": datetime.utcnow(), "status": "sent"}}
    )
    
    return {"message": "Email sent successfully (placeholder)"}
