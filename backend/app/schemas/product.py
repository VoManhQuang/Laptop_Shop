from pydantic import BaseModel, Field
from typing import Optional

class ProductBase(BaseModel):
    name: Optional[str] = None
    price: float = Field(..., gt=0)
    image: Optional[str] = None
    detail_desc: str = Field(..., min_length=1)
    short_desc: Optional[str] = None
    quantity: int = Field(..., ge=0)
    sold: Optional[int] = 0
    factory: Optional[str] = None
    target: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    image: Optional[str] = None
    detail_desc: Optional[str] = Field(None, min_length=1)
    short_desc: Optional[str] = None
    quantity: Optional[int] = Field(None, ge=0)
    factory: Optional[str] = None
    target: Optional[str] = None

class ProductOut(ProductBase):
    id: int

    class Config:
        from_attributes = True
