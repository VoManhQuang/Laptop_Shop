from pydantic import BaseModel
from typing import Optional

class OrderDetailBase(BaseModel):
    quantity: int
    price: float

class OrderDetailCreate(OrderDetailBase):
    product_id: int 

class OrderDetailResponse(OrderDetailBase):
    id: int
    order_id: int
    product_id: int

    class Config:
        from_attributes = True