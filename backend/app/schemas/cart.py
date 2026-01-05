from pydantic import BaseModel
from typing import List, Optional

class CartDetailOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    
    class Config:
        from_attributes = True

class CartOut(BaseModel):
    id: int
    sum: float      
    user_id: int
    
    cart_details: List[CartDetailOut] = [] 

    class Config:
        from_attributes = True