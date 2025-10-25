from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    username: str
    email: EmailStr
    passwordHash: str
    name: str
    role: str = Field(default="staff")  # admin, staff
    active: bool = Field(default=True)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    lastLogin: Optional[datetime] = None

    class Config:
        populate_by_name = True

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    name: str
    role: str = "staff"

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    name: str
    role: str
    active: bool