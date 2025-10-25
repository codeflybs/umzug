from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class CustomerAddress(BaseModel):
    street: str
    zipCode: str
    city: str
    country: str = Field(default="CH")

class Customer(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    customerNumber: str
    salutation: str  # Herr, Frau
    firstName: str
    lastName: str
    email: EmailStr
    phone: str
    address: CustomerAddress
    notes: Optional[str] = None
    active: bool = Field(default=True)
    createdBy: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class CustomerCreate(BaseModel):
    salutation: str
    firstName: str
    lastName: str
    email: EmailStr
    phone: str
    address: CustomerAddress
    notes: Optional[str] = None

class CustomerUpdate(BaseModel):
    salutation: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[CustomerAddress] = None
    notes: Optional[str] = None
    active: Optional[bool] = None