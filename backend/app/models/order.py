from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base 

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    total_price = Column(Float)
    receiver_name = Column(String(255))
    receiver_phone = Column(String(20))
    receiver_address = Column(String(255))
    status = Column(String(50), default="PENDING")
    order_date = Column(DateTime, default=datetime.now)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User") 
    details = relationship("OrderDetail", back_populates="order")