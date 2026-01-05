import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { productsApi } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import "./ManageProduct.css";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsApi.getAll();
      setProducts(res.data);
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await productsApi.delete(id);
        alert("Xóa thành công!");
        fetchProducts();
      } catch (error) {
        console.error(error);
        alert("Xóa thất bại! Có thể sản phẩm đang nằm trong đơn hàng.");
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="manage-product-container">
      <div className="title-section">
        <h2>Quản lý sản phẩm</h2>
        <button
          className="btn-create"
          onClick={() => navigate("/admin/products/create")}
        >
          <FaPlus /> Thêm sản phẩm
        </button>
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
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Kho</th>
                <th>Đã bán</th>
                <th>Hãng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>
                      {item.image ? (
                        <img
                          src={`http://localhost:8000/uploads/${item.image}`}
                          alt={item.name}
                          className="product-thumb"
                        />
                      ) : (
                        <span style={{ color: "#999", fontSize: "12px" }}>
                          No img
                        </span>
                      )}
                    </td>
                    <td style={{ maxWidth: "200px" }} title={item.name}>
                      {item.name.length > 30
                        ? item.name.substring(0, 30) + "..."
                        : item.name}
                    </td>
                    <td className="price-text">{formatCurrency(item.price)}</td>
                    <td>{item.quantity}</td>
                    <td>{item.sold || 0}</td>
                    <td>{item.factory}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          title="Xem chi tiết"
                          onClick={() => navigate(`/admin/products/${item.id}`)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="action-btn edit"
                          title="Sửa"
                          onClick={() =>
                            navigate(`/admin/products/update/${item.id}`)
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn delete"
                          title="Xóa"
                          onClick={() => handleDelete(item.id)}
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
                    colSpan="8"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Chưa có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* --- THANH PHÂN TRANG --- */}
          {products.length > itemsPerPage && (
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

export default ManageProduct;
