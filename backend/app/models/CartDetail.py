from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class CartDetail(Base):
    __tablename__ = "cart_detail"

    id = Column(Integer, primary_key=True, index=True)
    quantity = Column(Integer, default=0)
    price = Column(Float, default=0.0)
    cart_id = Column(Integer, ForeignKey("carts.id"))
    cart = relationship("Cart", back_populates="cart_details")
    product_id = Column(Integer, ForeignKey("products.id"))
    product = relationship("Product")

    def __repr__(self):
        return f"<CartDetail(id={self.id}, cart_id={self.cart_id}, product_id={self.product_id})>"