from pydantic import BaseModel, Field
from typing import Dict, Optional
from datetime import datetime

class AdditionalService(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    serviceId: str
    categoryId: str
    name: Dict[str, str]
    description: Dict[str, str]
    price: float = Field(default=0.0)
    priceType: str = Field(default="fixed")  # fixed, hourly
    hourlyRate: Optional[float] = None
    active: bool = Field(default=True)
    order: int = Field(default=0)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "serviceId": "cleaning",
                "categoryId": "umzug",
                "name": {
                    "de": "Reinigung",
                    "en": "Cleaning"
                },
                "description": {
                    "de": "Professionelle Endreinigung",
                    "en": "Professional final cleaning"
                },
                "price": 900.0,
                "priceType": "fixed",
                "active": True
            }
        }

class AdditionalServiceCreate(BaseModel):
    serviceId: str
    categoryId: str
    name: Dict[str, str]
    description: Dict[str, str]
    price: float = 0.0
    priceType: str = "fixed"
    hourlyRate: Optional[float] = None
    active: bool = True
    order: int = 0

class AdditionalServiceUpdate(BaseModel):
    name: Optional[Dict[str, str]] = None
    description: Optional[Dict[str, str]] = None
    price: Optional[float] = None
    priceType: Optional[str] = None
    hourlyRate: Optional[float] = None
    active: Optional[bool] = None
    order: Optional[int] = None