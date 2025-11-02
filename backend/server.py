from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from utils.auth import get_password_hash

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.getenv("MONGO_URL")
if not mongo_url:
    raise RuntimeError(
        "MONGO_URL environment variable is not set. "
        "Create backend/.env (or export MONGO_URL) before starting the server."
    )

db_name = os.getenv("DB_NAME")
if not db_name:
    raise RuntimeError(
        "DB_NAME environment variable is not set. "
        "Create backend/.env (or export DB_NAME) before starting the server."
    )

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Create the main app without a prefix
app = FastAPI(title="Multi-Service Offerte System", version="2.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Import routes after db is created
from .routes import auth, settings, categories, services, offers, customers, invoices

# Include all route modules
api_router.include_router(auth.router)
api_router.include_router(settings.router)
api_router.include_router(categories.router)
api_router.include_router(services.router)
api_router.include_router(offers.router)
api_router.include_router(customers.router)
api_router.include_router(invoices.router)

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Multi-Service Offerte System API", "version": "2.0.0", "status": "running"}

# Include the router in the main app
app.include_router(api_router)

# Serve uploaded files
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

DEFAULT_ADMIN_USERNAME = os.getenv("DEFAULT_ADMIN_USERNAME", "admin")
DEFAULT_ADMIN_PASSWORD = os.getenv("DEFAULT_ADMIN_PASSWORD", "admin123")
DEFAULT_ADMIN_EMAIL = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@example.com")

async def ensure_default_admin_user():
    """Ensure there is at least one admin user present."""
    existing_admin = await db.users.find_one({"username": DEFAULT_ADMIN_USERNAME})
    if existing_admin:
        return

    admin_user = {
        "username": DEFAULT_ADMIN_USERNAME,
        "email": DEFAULT_ADMIN_EMAIL,
        "passwordHash": get_password_hash(DEFAULT_ADMIN_PASSWORD),
        "name": "Administrator",
        "role": "admin",
        "active": True
    }
    await db.users.insert_one(admin_user)
    logger.info("Default admin user created (username: %s)", DEFAULT_ADMIN_USERNAME)

async def ensure_company_settings():
    """Ensure company settings document exists."""
    from models.company_settings import CompanySettings, Address
    
    existing_settings = await db.company_settings.find_one({"_id": "company_settings"})
    if existing_settings:
        return
    
    # Create minimal default settings if none exist
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
    logger.info("Default company settings created")

@app.on_event("startup")
async def startup_event():
    await ensure_default_admin_user()
    await ensure_company_settings()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
