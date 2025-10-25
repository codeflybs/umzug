"""
Initialize database with default data
Run this script once to populate the database with initial data
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from utils.auth import get_password_hash
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def init_database():
    # MongoDB connection
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("🔄 Initializing database...")
    
    # 1. Create default admin user
    existing_user = await db.users.find_one({"username": "admin"})
    if not existing_user:
        admin_user = {
            "username": "admin",
            "email": "admin@gelbe-umzuege.ch",
            "passwordHash": get_password_hash("admin123"),
            "name": "Administrator",
            "role": "admin",
            "active": True
        }
        await db.users.insert_one(admin_user)
        print("✅ Admin user created (username: admin, password: admin123)")
    else:
        print("ℹ️  Admin user already exists")
    
    # 2. Create company settings
    existing_settings = await db.company_settings.find_one({"_id": "company_settings"})
    if not existing_settings:
        company_settings = {
            "_id": "company_settings",
            "companyName": "Gelbe-Umzüge",
            "logo": "/uploads/logo.png",
            "addresses": [
                {
                    "type": "hauptsitz",
                    "street": "Sandstrasse 5",
                    "city": "Schönbühl",
                    "zipCode": "3322",
                    "country": "CH",
                    "phone": "031 557 24 31",
                    "email": "info@gelbe-umzuege.ch",
                    "website": "www.gelbe-umzuege.ch"
                },
                {
                    "type": "branch",
                    "street": "Güterstrasse 204",
                    "city": "Basel",
                    "zipCode": "4053",
                    "country": "CH",
                    "phone": "031 557 24 31",
                    "email": "info@gelbe-umzuege.ch",
                    "website": "www.gelbe-umzuege.ch"
                }
            ],
            "theme": {
                "primaryColor": "#EAB308",
                "secondaryColor": "#000000",
                "accentColor": "#FFFFFF"
            },
            "defaultLanguage": "de",
            "supportedLanguages": ["de", "en", "fr", "it"],
            "tax": {
                "enabled": True,
                "rate": 7.7,
                "label": "MwSt"
            },
            "email": {
                "smtpHost": "smtp.gmail.com",
                "smtpPort": 587,
                "smtpUser": "",
                "smtpPassword": "",
                "fromEmail": "noreply@gelbe-umzuege.ch",
                "fromName": "Gelbe-Umzüge"
            }
        }
        await db.company_settings.insert_one(company_settings)
        print("✅ Company settings created")
    else:
        print("ℹ️  Company settings already exist")
    
    # 3. Create default service categories
    categories = [
        {
            "categoryId": "umzug",
            "name": {
                "de": "Umzug",
                "en": "Moving",
                "fr": "Déménagement",
                "it": "Trasloco"
            },
            "description": {
                "de": "Professioneller Umzugsservice",
                "en": "Professional moving service",
                "fr": "Service de déménagement professionnel",
                "it": "Servizio di trasloco professionale"
            },
            "icon": "package",
            "active": True,
            "pricingModel": "custom",
            "basePrice": 0,
            "hourlyRate": 120,
            "formFields": ["currentAddress", "newAddress", "floor", "elevator", "movingDate", "startTime", "object", "workers", "trucks"]
        },
        {
            "categoryId": "moebeltransport",
            "name": {
                "de": "Möbeltransport",
                "en": "Furniture Transport",
                "fr": "Transport de meubles",
                "it": "Trasporto mobili"
            },
            "description": {
                "de": "Sicherer Transport von Möbeln",
                "en": "Safe furniture transportation",
                "fr": "Transport sécurisé de meubles",
                "it": "Trasporto sicuro di mobili"
            },
            "icon": "truck",
            "active": True,
            "pricingModel": "hourly",
            "basePrice": 0,
            "hourlyRate": 80,
            "formFields": ["pickupAddress", "deliveryAddress", "furnitureList"]
        },
        {
            "categoryId": "reinigung",
            "name": {
                "de": "Reinigung",
                "en": "Cleaning",
                "fr": "Nettoyage",
                "it": "Pulizia"
            },
            "description": {
                "de": "Professionelle Reinigungsservices",
                "en": "Professional cleaning services",
                "fr": "Services de nettoyage professionnel",
                "it": "Servizi di pulizia professionale"
            },
            "icon": "sparkles",
            "active": True,
            "pricingModel": "fixed",
            "basePrice": 900,
            "hourlyRate": 60,
            "formFields": ["address", "roomCount", "cleaningType", "cleaningDate"]
        }
    ]
    
    for category in categories:
        existing = await db.service_categories.find_one({"categoryId": category["categoryId"]})
        if not existing:
            await db.service_categories.insert_one(category)
            print(f"✅ Category created: {category['name']['de']}")
        else:
            print(f"ℹ️  Category already exists: {category['name']['de']}")
    
    # 4. Create default additional services
    additional_services = [
        {
            "serviceId": "cleaning",
            "categoryId": "umzug",
            "name": {
                "de": "Reinigung",
                "en": "Cleaning",
                "fr": "Nettoyage",
                "it": "Pulizia"
            },
            "description": {
                "de": "Professionelle Endreinigung der alten Wohnung",
                "en": "Professional final cleaning of the old apartment",
                "fr": "Nettoyage final professionnel de l'ancien appartement",
                "it": "Pulizia finale professionale del vecchio appartamento"
            },
            "price": 900.0,
            "priceType": "fixed",
            "active": True,
            "order": 1
        },
        {
            "serviceId": "disposal",
            "categoryId": "umzug",
            "name": {
                "de": "Entsorgung",
                "en": "Disposal",
                "fr": "Élimination",
                "it": "Smaltimento"
            },
            "description": {
                "de": "Entsorgung von Altmöbeln und Abfall",
                "en": "Disposal of old furniture and waste",
                "fr": "Élimination des vieux meubles et déchets",
                "it": "Smaltimento di vecchi mobili e rifiuti"
            },
            "price": 250.0,
            "priceType": "fixed",
            "active": True,
            "order": 2
        },
        {
            "serviceId": "packing",
            "categoryId": "umzug",
            "name": {
                "de": "Verpackungsservice",
                "en": "Packing Service",
                "fr": "Service d'emballage",
                "it": "Servizio di imballaggio"
            },
            "description": {
                "de": "Professionelles Verpacken Ihrer Gegenstände",
                "en": "Professional packing of your items",
                "fr": "Emballage professionnel de vos articles",
                "it": "Imballaggio professionale dei vostri articoli"
            },
            "price": 50.0,
            "priceType": "hourly",
            "hourlyRate": 50.0,
            "active": True,
            "order": 3
        }
    ]
    
    for service in additional_services:
        existing = await db.additional_services.find_one({"serviceId": service["serviceId"]})
        if not existing:
            await db.additional_services.insert_one(service)
            print(f"✅ Additional service created: {service['name']['de']}")
        else:
            print(f"ℹ️  Additional service already exists: {service['name']['de']}")
    
    print("\n✨ Database initialization completed!")
    print("\n📝 Login credentials:")
    print("   Username: admin")
    print("   Password: admin123")
    print("\n🌐 API Documentation: http://localhost:8001/docs")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(init_database())
