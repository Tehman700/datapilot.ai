from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, SessionLocal
from models import Base, User
from auth import hash_password
from routers.auth_router import router as auth_router
from routers.admin_router import router as admin_router


def _seed_admin(db):
    """Create the admin account on first run if it doesn't exist."""
    exists = db.query(User).filter(User.email == "testing@gmail.com").first()
    if not exists:
        db.add(
            User(
                name="Admin",
                email="testing@gmail.com",
                hashed_password=hash_password("test123"),
                is_admin=True,
            )
        )
        db.commit()
        print("[datapilot] Admin user seeded → testing@gmail.com / test123")


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        _seed_admin(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Datapilot AI API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router,  prefix="/api/auth",  tags=["auth"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])


@app.get("/api/health")
def health():
    return {"status": "ok"}
