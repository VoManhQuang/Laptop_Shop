import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { orderApi } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import "./ManageOrder.css";

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- State Phân trang ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAll();
      setOrders(res.data);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span
            className="status-badge pending"
            style={{
              color: "#059669",
              background: "#d1fae5",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            CHỜ XỬ LÝ
          </span>
        );
      case "SHIPPING":
        return (
          <span
            className="status-badge shipping"
            style={{
              color: "#059669",
              background: "#d1fae5",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            ĐANG GIAO
          </span>
        );
      case "COMPLETED":
        return (
          <span
            className="status-badge completed"
            style={{
              color: "#059669",
              background: "#d1fae5",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            HOÀN THÀNH
          </span>
        );
      case "CANCELLED":
        return (
          <span
            className="status-badge cancelled"
            style={{
              color: "#059669",
              background: "#d1fae5",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            ĐÃ HỦY
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này?")) {
      try {
        await orderApi.delete(id);
        const newOrders = orders.filter((item) => item.id !== id);
        setOrders(newOrders);
        alert("Đã xóa đơn hàng thành công!");

        if (
          currentPage > 1 &&
          newOrders.length <= (currentPage - 1) * itemsPerPage
        ) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Lỗi xóa đơn hàng:", error);
        alert("Xóa thất bại! Có thể do server chưa hỗ trợ hoặc lỗi mạng.");
      }
    }
  };

  // --- Logic Phân trang ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="manage-product-container">
      <div className="title-section">
        <h2>Quản lý đơn hàng</h2>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Đang tải dữ liệu...
        </p>
      ) : (
        <>
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Địa chỉ</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((item) => (
                  <tr key={item.id}>
                    <td style={{ color: "#2563eb", fontWeight: "bold" }}>
                      #{item.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: "bold", color: "#333" }}>
                        {item.receiver_name}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#666",
                          marginTop: "4px",
                        }}
                      >
                        {item.receiver_phone}
                      </div>
                      <small style={{ color: "#999" }}>
                        {item.user?.email}
                      </small>
                    </td>
                    <td style={{ maxWidth: "200px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "start",
                          gap: "5px",
                          lineHeight: "1.4",
                          fontSize: "14px",
                        }}
                      >
                        <span>
                          {item.receiver_address || "Chưa có địa chỉ"}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: "14px", color: "#555" }}>
                      {formatDate(item.order_date)}
                    </td>
                    <td
                      style={{
                        color: "#059669",
                        fontWeight: "bold",
                        fontSize: "15px",
                      }}
                    >
                      {formatCurrency(item.total_price)}
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          title="Xem chi tiết"
                          onClick={() => navigate(`/admin/orders/${item.id}`)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="action-btn edit"
                          style={{ background: "#fef3c7", color: "#d97706" }}
                          onClick={() =>
                            navigate(`/admin/orders/update/${item.id}`)
                          }
                          title="Cập nhật đơn hàng"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(item.id)}
                          title="Xóa đơn hàng"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "30px" }}
                  >
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* --- Thanh Phân trang --- */}
          {orders.length > itemsPerPage && (
            <div className="pagination-container">
              <button
                className="page-btn"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`page-num ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="page-btn"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageOrder;
