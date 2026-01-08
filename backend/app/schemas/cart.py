from pydantic import BaseModel
from typing import List, Optional

class ProductInCart(BaseModel):
    id: int
    name: str
    price: float
    image: Optional[str] = None
    quantity: int  # stock quantity
    
    class Config:
        from_attributes = True

class CartDetailOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: Optional[ProductInCart] = None
    
    class Config:
        from_attributes = True

class CartOut(BaseModel):
    id: int
    sum: float      
    user_id: int
    
    cart_details: List[CartDetailOut] = [] 

    class Config:
        from_attributes = True