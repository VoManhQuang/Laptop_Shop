from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from collections import defaultdict
from datetime import datetime, timedelta # <--- Import thêm timedelta

from ..models.User import User
from ..models.Product import Product
from ..models.Order import Order

router = APIRouter(prefix="/api/stats", tags=["Stats"])

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # 1. Số liệu tổng quan
    total_users = db.query(User).count()
    total_products = db.query(Product).count()
    total_orders = db.query(Order).count()
    
    total_revenue = db.query(func.sum(Order.total_price)).filter(
        Order.status == "COMPLETED"
    ).scalar() or 0

    # 2. XỬ LÝ BIỂU ĐỒ
    # Lấy đơn hàng trong DB
    orders = db.query(Order).order_by(Order.order_date.asc()).all()

    # --- A. Đơn hàng (14 ngày gần nhất) ---
    # Tạo danh sách 14 ngày gần nhất: [Hôm nay, Hôm qua, ..., 13 ngày trước]
    orders_map = {}
    end_date = datetime.now()
    # Tạo map với key là "dd-mm" (ví dụ "02-01") và value mặc định là 0
    for i in range(13, -1, -1):
        date_str = (end_date - timedelta(days=i)).strftime("%d-%m")
        orders_map[date_str] = 0

    # --- B. Doanh thu 12 tháng ---
    revenue_map = {f"T{i}": 0 for i in range(1, 13)}

    # Duyệt qua đơn hàng để điền số liệu
    for order in orders:
        # Xử lý ngày: Chỉ tính nếu đơn hàng nằm trong danh sách 14 ngày đã tạo
        date_key = order.order_date.strftime("%d-%m")
        if date_key in orders_map:
            orders_map[date_key] += 1

        # Xử lý doanh thu tháng
        if order.status == "COMPLETED":
            month_key = f"T{order.order_date.month}"
            if month_key in revenue_map:
                revenue_map[month_key] += order.total_price

    # Chuyển đổi sang List
    chart_orders = [{"name": k, "orders": v} for k, v in orders_map.items()]
    chart_revenue = [{"name": k, "revenue": v} for k, v in revenue_map.items()]

    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "chart_orders": chart_orders, 
        "chart_revenue": chart_revenue
    }