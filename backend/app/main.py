import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routers import stats

try:
    from .database import engine, Base
except ImportError:
    from database import engine, Base

from .routers import auth, product, cart, order, user, payment

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Laptop Shop API",
    description="API cho ứng dụng bán laptop với Authentication",
    version="1.0.0"
)

script_dir = os.path.dirname(__file__) 
base_dir = os.path.dirname(script_dir) 
upload_path = os.path.join(base_dir, "uploads")

if not os.path.exists(upload_path):
    os.makedirs(upload_path)

app.mount("/uploads", StaticFiles(directory=upload_path), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(product.router)
app.include_router(cart.router)
app.include_router(order.router)
app.include_router(user.router)
app.include_router(payment.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to Laptop Shop API",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "version": "1.0.0"
    }

app.include_router(stats.router)