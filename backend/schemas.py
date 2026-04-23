from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional


# ── Auth ────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip()


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ── API Keys ─────────────────────────────────────────────────────────────────

class APIKeyCreate(BaseModel):
    name: str
    service: str = "other"
    key_value: str

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Key name cannot be empty")
        return v.strip()

    @field_validator("key_value")
    @classmethod
    def key_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Key value cannot be empty")
        return v.strip()


class APIKeyOut(BaseModel):
    id: int
    name: str
    service: str
    key_masked: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ToggleResponse(BaseModel):
    id: int
    is_active: bool
