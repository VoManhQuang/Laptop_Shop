import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderApi } from "../../../services/api";
import {
  FaEdit,
  FaBoxOpen,
  FaInfoCircle,
  FaSave,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./ManageOrder.css";

const UpdateOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null); // Lưu toàn bộ object order
  const [status, setStatus] = useState(""); // Lưu riêng trạng thái để sửa

  // Load dữ liệu
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderApi.getById(id);
        setOrder(res.data);
        setStatus(res.data.status); // Set trạng thái ban đầu
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Không tìm thấy đơn hàng!");
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  // Xử lý lưu
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Chỉ gửi status mới, các thông tin khác giữ nguyên từ order cũ
      const updateData = {
        status: status,
        receiver_name: order.receiver_name,
        receiver_phone: order.receiver_phone,
        receiver_address: order.receiver_address,
      };

      await orderApi.update(id, updateData);
      alert("Cập nhật trạng thái thành công!");
      navigate("/admin/orders");
    } catch (error) {
      alert(
        "Lỗi cập nhật: " + (error.response?.data?.detail || "Có lỗi xảy ra")
      );
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (loading || !order)
    return <div style={{ padding: "20px" }}>Đang tải dữ liệu...</div>;

  return (
    <div className="manage-product-container">
      {/* Header Breadcrumb */}
      <div className="title-section">
        <div>
          <h2>Cập nhật đơn hàng #{id}</h2>
          <span className="breadcrumb">Dashboard / Orders / Update</span>
        </div>
        <button className="btn-back" onClick={() => navigate("/admin/orders")}>
          Quay lại
        </button>
      </div>

      <div className="update-order-layout">
        {/* === CỘT TRÁI: FORM CẬP NHẬT === */}
        <div className="update-left-col">
          <div className="update-header-orange">Thông tin cập nhật</div>

          <form className="update-form-content" onSubmit={handleSubmit}>
            {/* 1. Trạng thái (Được sửa) */}
            <div className="form-group">
              <label style={{ fontWeight: "bold", color: "#d35400" }}>
                Trạng thái đơn hàng <span style={{ color: "red" }}>*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PENDING">Chờ xử lý</option>
                <option value="SHIPPING">Đang giao</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Hủy đơn</option>
              </select>
            </div>

            {/* 2. Các ô Read-only (Bị khóa) */}
            <div className="form-group">
              <label>
                <FaUser style={{ fontSize: "12px" }} /> Tên người nhận
              </label>
              <input
                type="text"
                value={order.receiver_name}
                disabled
                className="input-disabled"
              />
            </div>

            <div className="form-group">
              <label>
                <FaPhone style={{ fontSize: "12px" }} /> Số điện thoại
              </label>
              <input
                type="text"
                value={order.receiver_phone}
                disabled
                className="input-disabled"
              />
            </div>

            <div className="form-group">
              <label>
                <FaMapMarkerAlt style={{ fontSize: "12px" }} /> Địa chỉ giao
                hàng
              </label>
              <textarea
                rows="3"
                value={order.receiver_address}
                disabled
                className="input-disabled"
              ></textarea>
            </div>

            {/* Nút lưu (Màu xanh lá) */}
            <button
              type="submit"
              className="btn-submit"
              style={{
                width: "100%",
                marginTop: "20px",
                background: "#00b894",
              }}
            >
              <FaSave /> Lưu thay đổi
            </button>
          </form>
        </div>

        {/* === CỘT PHẢI: CHI TIẾT ĐƠN HÀNG (READ ONLY) === */}
        <div className="update-right-col">
          <h4
            style={{
              borderBottom: "1px solid #eee",
              paddingBottom: "10px",
              marginBottom: "15px",
            }}
          >
            Chi tiết đơn hàng
          </h4>

          {/* Tổng quan */}
          <div className="order-summary-item">
            <span style={{ color: "#666", fontWeight: "bold" }}>
              Mã đơn hàng:
            </span>
            <span style={{ color: "#2980b9", fontWeight: "bold" }}>
              #{order.id}
            </span>
          </div>
          <div className="order-summary-item">
            <span style={{ color: "#666", fontWeight: "bold" }}>
              Tổng tiền:
            </span>
            <span
              style={{ color: "#e74c3c", fontWeight: "bold", fontSize: "18px" }}
            >
              {formatCurrency(order.total_price)}
            </span>
          </div>

          {/* Danh sách sản phẩm */}
          <h5
            style={{
              marginTop: "30px",
              marginBottom: "15px",
              color: "#2c3e50",
            }}
          >
            {/* SỬA LẠI: dùng order.details và thêm dấu ? để an toàn */}
            Danh sách sản phẩm ({order.details?.length || 0} sản phẩm)
          </h5>

          <div
            style={{
              background: "#f9f9f9",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {/* Header bảng nhỏ */}
            <div
              style={{
                display: "flex",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#888",
                marginBottom: "10px",
              }}
            >
              <div style={{ flex: 2 }}>TÊN SẢN PHẨM</div>
              <div style={{ flex: 1, textAlign: "center" }}>SỐ LƯỢNG</div>
              <div style={{ flex: 1, textAlign: "right" }}>ĐƠN GIÁ</div>
            </div>

            {/* SỬA LẠI: dùng order.details.map */}
            {order.details?.map((item, index) => (
              <div key={index} className="product-list-item">
                <div style={{ flex: 2, fontWeight: "500" }}>
                  {item.product?.name}
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span className="badge-qty">x{item.quantity}</span>
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: "right",
                    color: "#00b894",
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(item.price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
