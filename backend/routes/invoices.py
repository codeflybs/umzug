from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from models.invoice import Invoice, InvoiceCreate, InvoiceUpdate, InvoiceItem
from .auth import get_current_user

router = APIRouter(prefix="/invoices", tags=["Invoices"])

from ..server import db

@router.get("/next-number")
async def get_next_invoice_number(current_user: dict = Depends(get_current_user)):
    """Get next available invoice number"""
    # Find the highest invoice number
    last_invoice = await db.invoices.find_one(sort=[("invoiceNumber", -1)])
    
    if last_invoice:
        try:
            last_number = int(last_invoice["invoiceNumber"])
            next_number = str(last_number + 1).zfill(6)
        except:
            next_number = "100001"
    else:
        next_number = "100001"
    
    return {"nextInvoiceNumber": next_number}

@router.get("", response_model=List[Invoice])
async def list_invoices(
    status: Optional[str] = None,
    customer_id: Optional[str] = None,
    limit: int = Query(default=50, le=100),
    skip: int = 0,
    current_user: dict = Depends(get_current_user)
):
    """List invoices"""
    query = {}
    if status:
        query["status"] = status
    if customer_id:
        query["customerId"] = customer_id
    
    invoices = await db.invoices.find(query).sort("createdAt", -1).skip(skip).limit(limit).to_list(limit)
    
    for invoice in invoices:
        invoice["_id"] = str(invoice["_id"])
    
    return invoices

@router.get("/{invoice_id}")
async def get_invoice(invoice_id: str, current_user: dict = Depends(get_current_user)):
    """Get invoice by ID"""
    try:
        invoice = await db.invoices.find_one({"_id": ObjectId(invoice_id)})
    except:
        invoice = await db.invoices.find_one({"invoiceNumber": invoice_id})
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    invoice["_id"] = str(invoice["_id"])
    return invoice

@router.post("", response_model=Invoice)
async def create_invoice(
    invoice: InvoiceCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new invoice"""
    # Get next invoice number
    next_number_response = await get_next_invoice_number(current_user)
    invoice_number = next_number_response["nextInvoiceNumber"]
    
    # Calculate totals
    subtotal = sum(item.total for item in invoice.items)
    tax_amount = subtotal * (invoice.taxRate / 100)
    total = subtotal + tax_amount
    
    invoice_dict = invoice.dict()
    invoice_dict["invoiceNumber"] = invoice_number
    invoice_dict["subtotal"] = subtotal
    invoice_dict["taxAmount"] = tax_amount
    invoice_dict["total"] = total
    invoice_dict["currency"] = "CHF"
    invoice_dict["status"] = "draft"
    invoice_dict["createdBy"] = str(current_user["_id"])
    invoice_dict["createdAt"] = datetime.utcnow()
    invoice_dict["updatedAt"] = datetime.utcnow()
    
    result = await db.invoices.insert_one(invoice_dict)
    invoice_dict["_id"] = str(result.inserted_id)
    
    return Invoice(**invoice_dict)

@router.put("/{invoice_id}")
async def update_invoice(
    invoice_id: str,
    invoice: InvoiceUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update invoice"""
    update_data = {k: v for k, v in invoice.dict(exclude_unset=True).items()}
    
    # Recalculate if items changed
    if "items" in update_data:
        subtotal = sum(item["total"] for item in update_data["items"])
        # Get tax rate from existing invoice
        existing = await db.invoices.find_one({"_id": ObjectId(invoice_id)})
        if existing:
            tax_rate = existing.get("taxRate", 7.7)
            tax_amount = subtotal * (tax_rate / 100)
            total = subtotal + tax_amount
            update_data["subtotal"] = subtotal
            update_data["taxAmount"] = tax_amount
            update_data["total"] = total
    
    update_data["updatedAt"] = datetime.utcnow()
    
    try:
        result = await db.invoices.update_one(
            {"_id": ObjectId(invoice_id)},
            {"$set": update_data}
        )
    except:
        raise HTTPException(status_code=400, detail="Invalid invoice ID")
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    return {"message": "Invoice updated successfully"}

@router.delete("/{invoice_id}")
async def delete_invoice(
    invoice_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete invoice"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        result = await db.invoices.delete_one({"_id": ObjectId(invoice_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid invoice ID")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    return {"message": "Invoice deleted successfully"}

@router.post("/{invoice_id}/generate-pdf")
async def generate_invoice_pdf(
    invoice_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Generate PDF for invoice (placeholder)"""
    invoice = await db.invoices.find_one({"_id": ObjectId(invoice_id)})
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # This will be implemented with WeasyPrint later
    return {"message": "PDF generation coming soon", "invoiceId": invoice_id}
