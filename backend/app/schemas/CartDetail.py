from pydantic import BaseModel, Field
from typing import Optional

class CartDetailBase(BaseModel):
    quantity: int = Field(..., ge=1, description="Số lượng mua phải ít nhất là 1")
    price: float = Field(..., ge=0)

class CartDetailCreate(CartDetailBase):
    product_id: int

class CartDetailResponse(CartDetailBase):
    id: int
    cart_id: int
    product_id: int
    
    class Config:
        from_attributes = True