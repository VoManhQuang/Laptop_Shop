import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { orderApi } from "../../../services/api";
import {
  FaHistory,
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBoxOpen,
} from "react-icons/fa";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const res = await orderApi.getMyOrders();
      setOrders(res.data);
    } catch (error) {
      console.error("Lỗi lấy lịch sử đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "SHIPPING":
        return "Đang giao hàng";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#f1c40f";
      case "SHIPPING":
        return "#3498db";
      case "COMPLETED":
        return "#2ecc71";
      case "CANCELLED":
        return "#e74c3c";
      default:
        return "#ecf0f1";
    }
  };

  return (
    <div className="page-wrapper">
      <Header />

      <div className="history-container">
        <div className="history-header">
          <h2>
            <FaHistory /> Lịch sử đơn hàng
          </h2>
          <div className="order-count-badge">
            Tổng: {orders.length} đơn hàng
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center" }}>Đang tải dữ liệu...</p>
        ) : orders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "50px",
              background: "white",
              borderRadius: "10px",
            }}
          >
            <FaBoxOpen size={50} color="#ccc" />
            <p>Bạn chưa có đơn hàng nào.</p>
            <Link to="/" style={{ color: "#6c5ce7", fontWeight: "bold" }}>
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <span>📝 Đơn hàng #{order.id}</span>
                  <span
                    className="status-badge"
                    style={{
                      background: getStatusColor(order.status),
                      color: order.status === "PENDING" ? "#333" : "white",
                    }}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="order-info-section">
                  <div className="info-box">
                    <div className="info-icon">
                      <FaUser />
                    </div>
                    <div className="info-text">
                      <label>Người nhận</label>
                      <span>{order.receiver_name}</span>
                    </div>
                  </div>
                  <div className="info-box">
                    <div className="info-icon">
                      <FaPhone />
                    </div>
                    <div className="info-text">
                      <label>Số điện thoại</label>
                      <span>{order.receiver_phone}</span>
                    </div>
                  </div>
                  <div className="info-box">
                    <div className="info-icon">
                      <FaCalendarAlt />
                    </div>
                    <div className="info-text">
                      <label>Ngày đặt hàng</label>
                      <span>{formatDate(order.order_date)}</span>
                    </div>
                  </div>

                  <div className="info-box" style={{ gridColumn: "1 / -1" }}>
                    <div className="info-icon">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="info-text">
                      <label>Địa chỉ giao hàng</label>
                      <span>{order.receiver_address}</span>
                    </div>
                  </div>
                </div>

                <div className="order-products-list">
                  <h4
                    style={{
                      padding: "10px 0",
                      borderBottom: "2px solid #6c5ce7",
                      display: "inline-block",
                      marginBottom: "0",
                    }}
                  >
                    Sản phẩm trong đơn hàng
                  </h4>
                  {order.details?.map((item) => (
                    <div key={item.id} className="product-item">
                      <img
                        src={
                          item.product?.image
                            ? `http://localhost:8000/uploads/${item.product.image}`
                            : "https://via.placeholder.com/80"
                        }
                        alt={item.product?.name}
                        className="product-img"
                      />
                      <div className="product-details">
                        <div className="product-name">{item.product?.name}</div>
                        <div className="product-meta">
                          Đơn giá: {formatCurrency(item.price)} &nbsp;|&nbsp; Số
                          lượng: {item.quantity}
                        </div>
                      </div>
                      <div className="product-total">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="footer-row">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(order.total_price)}</span>
                  </div>
                  <div className="footer-row">
                    <span>Phí vận chuyển</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="footer-row final">
                    <span>Tổng thanh toán</span>
                    <span>{formatCurrency(order.total_price)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistory;
