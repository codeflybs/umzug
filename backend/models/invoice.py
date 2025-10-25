from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date

class InvoiceItem(BaseModel):
    description: str
    quantity: float = 1.0
    unitPrice: float
    total: float

class QRBillData(BaseModel):
    iban: str
    creditorName: str
    creditorAddress: str
    creditorCity: str
    creditorZipCode: str
    creditorCountry: str = "CH"
    amount: float
    currency: str = "CHF"
    debtorName: Optional[str] = None
    debtorAddress: Optional[str] = None
    debtorCity: Optional[str] = None
    debtorZipCode: Optional[str] = None
    reference: Optional[str] = None

class Invoice(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    invoiceNumber: str
    offerId: Optional[str] = None
    customerId: str
    invoiceDate: date
    dueDate: date
    status: str = Field(default="draft")  # draft, sent, paid, overdue, cancelled
    items: List[InvoiceItem]
    subtotal: float
    taxRate: float
    taxAmount: float
    total: float
    currency: str = Field(default="CHF")
    qrBill: Optional[QRBillData] = None
    notes: Optional[str] = None
    pdfUrl: Optional[str] = None
    createdBy: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class InvoiceCreate(BaseModel):
    offerId: Optional[str] = None
    customerId: str
    invoiceDate: date
    dueDate: date
    items: List[InvoiceItem]
    taxRate: float = 7.7
    qrBill: Optional[QRBillData] = None
    notes: Optional[str] = None

class InvoiceUpdate(BaseModel):
    status: Optional[str] = None
    dueDate: Optional[date] = None
    items: Optional[List[InvoiceItem]] = None
    notes: Optional[str] = None