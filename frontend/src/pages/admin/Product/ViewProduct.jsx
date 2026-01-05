import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productsApi } from "../../../services/api";
import "../User/CreateUser.css"; // Tái sử dụng CSS

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productsApi.getById(id);
        setProduct(res.data);

        if (res.data.image) {
          setPreview(`http://localhost:8000/uploads/${res.data.image}`);
        }
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        alert("Không tìm thấy sản phẩm!");
        navigate("/admin/products");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (!product)
    return <div style={{ padding: "20px" }}>Đang tải dữ liệu...</div>;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="create-user-container">
      <div className="header-actions">
        <div>
          <h2>Chi tiết sản phẩm</h2>
          <span className="breadcrumb">
            Dashboard / Products / View Details
          </span>
        </div>
        <button
          className="btn-back"
          onClick={() => navigate("/admin/products")}
        >
          Quay lại
        </button>
      </div>

      <form className="create-form">
        <div className="form-row">
          <div className="form-group">
            <label>ID Sản phẩm</label>
            <input
              type="text"
              value={product.id}
              disabled
              style={{ background: "#f1f1f1" }}
            />
          </div>
          <div className="form-group">
            <label>Tên sản phẩm</label>
            <input type="text" value={product.name} disabled />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Hãng sản xuất</label>
            <input type="text" value={product.factory || "---"} disabled />
          </div>
          <div className="form-group">
            <label>Giá (VNĐ)</label>
            <input
              type="text"
              value={formatCurrency(product.price)}
              disabled
              style={{ color: "#d32f2f", fontWeight: "bold" }}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Số lượng kho</label>
            <input type="text" value={product.quantity} disabled />
          </div>
          <div className="form-group">
            <label>Đã bán</label>
            <input type="text" value={product.sold || 0} disabled />
          </div>
          <div className="form-group">
            <label>Đối tượng</label>
            <input type="text" value={product.target || "---"} disabled />
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả ngắn</label>
          <input type="text" value={product.short_desc || ""} disabled />
        </div>

        <div className="form-group">
          <label>Mô tả chi tiết</label>
          <textarea
            rows="5"
            value={product.detail_desc || ""}
            disabled
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              background: "#f9fafb",
            }}
          />
        </div>

        <div className="form-row">
          <div
            className="preview-section"
            style={{ marginTop: 0, width: "100%" }}
          >
            <label>Hình ảnh sản phẩm</label>
            <div
              className="img-preview-box"
              style={{ width: "200px", height: "200px" }}
            >
              {preview ? (
                <img src={preview} alt="Product Img" />
              ) : (
                <span>No Image</span>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ViewProduct;
