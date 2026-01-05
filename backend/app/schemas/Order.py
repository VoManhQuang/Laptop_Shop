from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItemSchema(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderCreate(BaseModel):
    receiver_name: str
    receiver_phone: str
    receiver_address: str
    total_price: float
    status: str = "PENDING"
    user_id: Optional[int] = None
    items: List[OrderItemSchema] 

class ProductShort(BaseModel):
    name: str
    image: Optional[str] = None
    class Config:
        from_attributes = True

class OrderDetailOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: Optional[ProductShort] = None

    class Config:
        from_attributes = True

class UserShort(BaseModel):
    email: str
    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    total_price: float
    receiver_name: Optional[str] = None
    receiver_phone: Optional[str] = None
    receiver_address: Optional[str] = None
    status: str
    order_date: datetime

    user: Optional[UserShort] = None

    details: List[OrderDetailOut] = [] 

    class Config:
        from_attributes = True

class OrderUpdate(BaseModel):
    receiver_name: Optional[str] = None
    receiver_phone: Optional[str] = None
    receiver_address: Optional[str] = None
    status: Optional[str] = None