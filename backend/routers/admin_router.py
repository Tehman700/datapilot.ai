from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from auth import require_admin
from database import get_db

router = APIRouter()


def _mask(key: str) -> str:
    if len(key) <= 10:
        return "****"
    return key[:4] + "****" + key[-4:]


@router.get("/api-keys", response_model=List[schemas.APIKeyOut])
def list_keys(
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    keys = db.query(models.APIKey).order_by(models.APIKey.created_at.desc()).all()
    return [
        schemas.APIKeyOut(
            id=k.id,
            name=k.name,
            service=k.service,
            key_masked=_mask(k.key_value),
            is_active=k.is_active,
            created_at=k.created_at,
        )
        for k in keys
    ]


@router.post("/api-keys", response_model=schemas.APIKeyOut, status_code=201)
def create_key(
    body: schemas.APIKeyCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    key = models.APIKey(
        name=body.name,
        service=body.service,
        key_value=body.key_value,
        created_by=admin.id,
    )
    db.add(key)
    db.commit()
    db.refresh(key)
    return schemas.APIKeyOut(
        id=key.id,
        name=key.name,
        service=key.service,
        key_masked=_mask(key.key_value),
        is_active=key.is_active,
        created_at=key.created_at,
    )


@router.patch("/api-keys/{key_id}/toggle", response_model=schemas.ToggleResponse)
def toggle_key(
    key_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    key = db.query(models.APIKey).filter(models.APIKey.id == key_id).first()
    if not key:
        raise HTTPException(status_code=404, detail="Key not found")
    key.is_active = not key.is_active
    db.commit()
    return {"id": key.id, "is_active": key.is_active}


@router.delete("/api-keys/{key_id}", status_code=204)
def delete_key(
    key_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    key = db.query(models.APIKey).filter(models.APIKey.id == key_id).first()
    if not key:
        raise HTTPException(status_code=404, detail="Key not found")
    db.delete(key)
    db.commit()
