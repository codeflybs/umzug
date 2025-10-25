from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class Address(BaseModel):
    type: str = Field(default="hauptsitz")
    street: str
    city: str
    zipCode: str
    country: str = Field(default="CH")
    phone: str
    email: str
    website: Optional[str] = None

class Theme(BaseModel):
    primaryColor: str = Field(default="#EAB308")
    secondaryColor: str = Field(default="#000000")
    accentColor: str = Field(default="#FFFFFF")

class TaxSettings(BaseModel):
    enabled: bool = Field(default=True)
    rate: float = Field(default=7.7)
    label: str = Field(default="MwSt")

class EmailSettings(BaseModel):
    smtpHost: str = Field(default="smtp.gmail.com")
    smtpPort: int = Field(default=587)
    smtpUser: str = ""
    smtpPassword: str = ""
    fromEmail: str = ""
    fromName: str = ""

class CompanySettings(BaseModel):
    id: str = Field(default="company_settings", alias="_id")
    companyName: str = Field(default="Gelbe-Umzüge")
    logo: Optional[str] = Field(default="/uploads/logo.png")
    addresses: List[Address] = []
    theme: Theme = Field(default_factory=Theme)
    defaultLanguage: str = Field(default="de")
    supportedLanguages: List[str] = Field(default=["de", "en", "fr", "it"])
    tax: TaxSettings = Field(default_factory=TaxSettings)
    email: EmailSettings = Field(default_factory=EmailSettings)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "company_settings",
                "companyName": "Gelbe-Umzüge",
                "logo": "/uploads/logo.png",
                "addresses": [{
                    "type": "hauptsitz",
                    "street": "Sandstrasse 5",
                    "city": "Schönbühl",
                    "zipCode": "3322",
                    "country": "CH",
                    "phone": "031 557 24 31",
                    "email": "info@gelbe-umzuege.ch",
                    "website": "www.gelbe-umzuege.ch"
                }]
            }
        }