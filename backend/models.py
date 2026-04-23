from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id             = Column(Integer, primary_key=True, index=True)
    name           = Column(String(120), nullable=False)
    email          = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_admin       = Column(Boolean, default=False, nullable=False)
    created_at     = Column(DateTime, default=datetime.utcnow)

    api_keys = relationship("APIKey", back_populates="creator")


class APIKey(Base):
    __tablename__ = "api_keys"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(120), nullable=False)
    service     = Column(String(60), default="other", nullable=False)
    key_value   = Column(String(512), nullable=False)
    is_active   = Column(Boolean, default=True, nullable=False)
    created_by  = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)

    creator = relationship("User", back_populates="api_keys")
