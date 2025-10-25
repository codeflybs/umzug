from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime

class ServiceCategory(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    categoryId: str
    name: Dict[str, str]
    description: Dict[str, str]
    icon: str = Field(default="package")
    active: bool = Field(default=True)
    pricingModel: str = Field(default="custom")  # custom, hourly, fixed
    basePrice: float = Field(default=0.0)
    hourlyRate: float = Field(default=0.0)
    formFields: List[str] = []
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "categoryId": "umzug",
                "name": {
                    "de": "Umzug",
                    "en": "Moving",
                    "fr": "Déménagement",
                    "it": "Trasloco"
                },
                "description": {
                    "de": "Professioneller Umzugsservice",
                    "en": "Professional moving service"
                },
                "icon": "package",
                "active": True,
                "pricingModel": "custom",
                "formFields": ["currentAddress", "newAddress", "floor", "elevator"]
            }
        }

class ServiceCategoryCreate(BaseModel):
    categoryId: str
    name: Dict[str, str]
    description: Dict[str, str]
    icon: str = "package"
    active: bool = True
    pricingModel: str = "custom"
    basePrice: float = 0.0
    hourlyRate: float = 0.0
    formFields: List[str] = []

class ServiceCategoryUpdate(BaseModel):
    name: Optional[Dict[str, str]] = None
    description: Optional[Dict[str, str]] = None
    icon: Optional[str] = None
    active: Optional[bool] = None
    pricingModel: Optional[str] = None
    basePrice: Optional[float] = None
    hourlyRate: Optional[float] = None
    formFields: Optional[List[str]] = None