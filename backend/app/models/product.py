from sqlalchemy import Column, Integer, String, Float, Text
from database import Base  

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=True)
    price = Column(Float, nullable=False)
    image = Column(String(500), nullable=True)
    detail_desc = Column(Text, nullable=False)
    short_desc = Column(Text, nullable=True) 
    quantity = Column(Integer, nullable=False)
    sold = Column(Integer, default=0)
    factory = Column(String(100), nullable=True)
    target = Column(String(100), nullable=True)

    def __repr__(self):
        return f"<Product(id={self.id}, name={self.name}, price={self.price})>"