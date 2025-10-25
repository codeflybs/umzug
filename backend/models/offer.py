from pydantic import BaseModel, Field, EmailStr
from typing import Dict, List, Optional
from datetime import datetime

class Customer(BaseModel):
    salutation: str
    firstName: str
    lastName: str
    email: EmailStr
    phone: str

class Location(BaseModel):
    street: str
    zipCode: str
    city: str
    floor: int = 0
    hasElevator: bool = False
    distance: float = 0.0

class ServiceDetails(BaseModel):
    movingDate: Optional[str] = None
    startTime: Optional[str] = None
    cleaningDate: Optional[str] = None
    cleaningStartTime: Optional[str] = None
    object: Optional[str] = None
    workers: int = 2
    trucks: int = 1
    boxes: int = 0
    assembly: bool = False

class SelectedService(BaseModel):
    serviceId: str
    selected: bool
    price: float

class Pricing(BaseModel):
    basePrice: float = 0.0
    additionalServicesTotal: float = 0.0
    subtotal: float = 0.0
    discount: float = 0.0
    discountType: str = "percentage"  # percentage, fixed
    taxRate: float = 7.7
    taxAmount: float = 0.0
    total: float = 0.0
    currency: str = "CHF"
    includeTax: bool = False

class Offer(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    offerNumber: str
    customerId: Optional[str] = None
    status: str = Field(default="draft")  # draft, sent, accepted, rejected
    category: str
    language: str = Field(default="de")
    customer: Customer
    currentLocation: Location
    newLocation: Location
    serviceDetails: ServiceDetails
    additionalServices: List[SelectedService] = []
    pricing: Pricing
    notes: Optional[str] = None
    pdfUrl: Optional[str] = None
    emailSent: bool = False
    emailSentAt: Optional[datetime] = None
    contactPerson: Optional[str] = None
    createdBy: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class OfferCreate(BaseModel):
    offerNumber: str
    category: str
    language: str = "de"
    customer: Customer
    currentLocation: Location
    newLocation: Location
    serviceDetails: ServiceDetails
    additionalServices: List[SelectedService] = []
    pricing: Pricing
    notes: Optional[str] = None
    contactPerson: Optional[str] = None

class OfferUpdate(BaseModel):
    status: Optional[str] = None
    customer: Optional[Customer] = None
    currentLocation: Optional[Location] = None
    newLocation: Optional[Location] = None
    serviceDetails: Optional[ServiceDetails] = None
    additionalServices: Optional[List[SelectedService]] = None
    pricing: Optional[Pricing] = None
    notes: Optional[str] = None
    contactPerson: Optional[str] = None