from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import datetime

from database import get_db
from ..models.Order import Order
from ..models.OrderDetail import OrderDetail
from ..models.User import User        
from ..models.Product import Product  
from ..schemas.Order import OrderOut, OrderUpdate, OrderCreate
from .auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["Orders"])

@router.post("", status_code=status.HTTP_201_CREATED)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    try:
        new_order = Order(
            receiver_name=order_data.receiver_name,
            receiver_phone=order_data.receiver_phone,
            receiver_address=order_data.receiver_address,
            total_price=order_data.total_price,
            status=order_data.status,
            user_id=order_data.user_id,
            order_date=datetime.now()
        )
        
        db.add(new_order)
        db.commit()
        db.refresh(new_order) 

        for item in order_data.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            
            if not product:
                db.delete(new_order)
                db.commit()
                raise HTTPException(status_code=404, detail=f"Sản phẩm ID {item.product_id} không tồn tại")

            if product.quantity < item.quantity:
                db.delete(new_order)
                db.commit()
                raise HTTPException(status_code=400, detail=f"Sản phẩm '{product.name}' không đủ hàng (Chỉ còn {product.quantity})")

            new_detail = OrderDetail(
                order_id=new_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=item.price
            )
            db.add(new_detail)
        
        db.commit() 
        return {"message": "Đặt hàng thành công", "id": new_order.id}

    except HTTPException as http_ex:
        raise http_ex 
    except Exception as e:
        db.rollback()
        print(f"Lỗi: {e}")
        raise HTTPException(status_code=500, detail="Lỗi Server khi tạo đơn hàng")

# --- 2. XEM TẤT CẢ ĐƠN HÀNG ---
@router.get("", response_model=List[OrderOut])
def get_all_orders(db: Session = Depends(get_db)): 
    orders = db.query(Order).options(
        joinedload(Order.user) 
    ).order_by(Order.order_date.desc()).all()
    return orders

@router.get("/my-orders", response_model=List[OrderOut])
def get_my_orders(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    orders = db.query(Order).options(
        joinedload(Order.details).joinedload(OrderDetail.product)
    ).filter(Order.user_id == current_user.id).order_by(Order.order_date.desc()).all()
    return orders

# --- 3. XEM CHI TIẾT ---
@router.get("/{id}", response_model=OrderOut)
def get_order_detail(id: int, db: Session = Depends(get_db)):
    order = db.query(Order).options(
        joinedload(Order.user),                         
        joinedload(Order.details).joinedload(OrderDetail.product) 
    ).filter(Order.id == id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    return order

@router.put("/{id}", response_model=OrderOut)
def update_order(
    id: int, 
    order_update: OrderUpdate, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")

    db_order = db.query(Order).filter(Order.id == id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")

    old_status = db_order.status

    update_data = order_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_order, key, value) 

    if db_order.status == "COMPLETED" and old_status != "COMPLETED":
        for detail in db_order.details:
            product = db.query(Product).filter(Product.id == detail.product_id).first()
            if product:
                if product.quantity < detail.quantity:
                    raise HTTPException(status_code=400, detail=f"Không thể hoàn thành đơn: Sản phẩm '{product.name}' không đủ tồn kho.")

                product.quantity = product.quantity - detail.quantity
                product.sold = (product.sold or 0) + detail.quantity

    db.commit()
    
    db_order = db.query(Order).options(
        joinedload(Order.user), 
        joinedload(Order.details).joinedload(OrderDetail.product)
    ).filter(Order.id == id).first()
    
    return db_order

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")

    db.delete(order)
    db.commit()
    return None