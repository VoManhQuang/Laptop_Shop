import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderApi } from "../../../services/api";
import "../Product/ManageProduct.css";

const ViewOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderApi.getById(id);
        setOrder(res.data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết đơn hàng:", error);
        alert("Không tìm thấy đơn hàng!");
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  if (loading)
    return <div style={{ padding: "20px" }}>Đang tải dữ liệu...</div>;
  if (!order) return null;

  // Format tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Format ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <div className="manage-product-container">
      {/* Header */}
      <div className="title-section">
        <div>
          <h2>Chi tiết đơn hàng #{order.id}</h2>
          <span className="breadcrumb">Dashboard / Orders / Detail</span>
        </div>
        <button className="btn-back" onClick={() => navigate("/admin/orders")}>
          Quay lại
        </button>
      </div>

      <div className="create-form">
        {/* KHỐI 1: THÔNG TIN KHÁCH HÀNG & TRẠNG THÁI */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          {/* Cột trái: Thông tin người nhận */}
          <div
            style={{
              flex: 1,
              padding: "15px",
              background: "#f9fafb",
              borderRadius: "8px",
            }}
          >
            <h4
              style={{
                margin: "0 0 10px 0",
                borderBottom: "1px solid #eee",
                paddingBottom: "5px",
              }}
            >
              Thông tin giao hàng
            </h4>
            <p>
              <strong>Người nhận:</strong> {order.receiver_name}
            </p>
            <p>
              <strong>SĐT:</strong> {order.receiver_phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {order.receiver_address}
            </p>
            <p>
              <strong>Email đặt hàng:</strong> {order.user?.email}
            </p>
          </div>

          {/* Cột phải: Thông tin đơn hàng */}
          <div
            style={{
              flex: 1,
              padding: "15px",
              background: "#f9fafb",
              borderRadius: "8px",
            }}
          >
            <h4
              style={{
                margin: "0 0 10px 0",
                borderBottom: "1px solid #eee",
                paddingBottom: "5px",
              }}
            >
              Thông tin đơn hàng
            </h4>
            <p>
              <strong>Ngày đặt:</strong> {formatDate(order.order_date)}
            </p>
            <p>
              <strong>Trạng thái:</strong>
              <span
                style={{
                  marginLeft: "10px",
                  fontWeight: "bold",
                  color: "#2563eb",
                }}
              >
                {order.status}
              </span>
            </p>
            <p>
              <strong>Tổng tiền:</strong>
              <span
                style={{
                  marginLeft: "10px",
                  color: "#d32f2f",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {formatCurrency(order.total_price)}
              </span>
            </p>
          </div>
        </div>

        {/* KHỐI 2: DANH SÁCH SẢN PHẨM */}
        <h4 style={{ marginBottom: "15px" }}>Danh sách sản phẩm</h4>
        <table className="product-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Sản phẩm</th>
              <th>Giá</th>
              {/* SỬA: Thêm textAlign center cho tiêu đề Số lượng */}
              <th style={{ textAlign: "center" }}>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.details?.map((detail, index) => (
              <tr key={detail.id}>
                <td>{index + 1}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {detail.product?.image && (
                      <img
                        src={`http://localhost:8000/uploads/${detail.product.image}`}
                        alt={detail.product.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                    <span>{detail.product?.name || "Sản phẩm đã bị xóa"}</span>
                  </div>
                </td>
                <td>{formatCurrency(detail.price)}</td>

                {/* Dữ liệu số lượng đã được căn giữa ở đây */}
                <td style={{ textAlign: "center" }}>{detail.quantity}</td>

                <td style={{ fontWeight: "bold" }}>
                  {formatCurrency(detail.price * detail.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewOrder;
