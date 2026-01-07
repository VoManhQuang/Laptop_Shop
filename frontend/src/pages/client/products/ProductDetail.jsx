import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productsApi } from "../../../services/api";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { useCart } from "../../../context/CartContext";
import {
  FaStar,
  FaCheckCircle,
  FaTruck,
  FaShieldAlt,
  FaCartPlus,
} from "react-icons/fa";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productsApi.getById(id);
        setProduct(res.data);
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Không tìm thấy sản phẩm!");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (loading)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Đang tải dữ liệu...
      </div>
    );
  if (!product) return null;

  return (
    <div className="product-detail-container">
      <Header />

      {/* Breadcrumb */}
      <div className="breadcrumb-nav">
        Trang chủ <span>/</span> Sản phẩm <span>/</span>{" "}
        <strong>{product.name}</strong>
      </div>

      <div className="product-main-content">
        {/* Cột trái: Ảnh */}
        <div className="product-image-col">
          <img
            src={`http://localhost:8000/uploads/${product.image}`}
            alt={product.name}
            className="main-image"
          />
        </div>

        <div className="product-info-col">
          <h1 className="detail-title">{product.name}</h1>

          <div className="detail-meta">
            <div className="rating-stars">
              4.9 <FaStar size={14} /> |
            </div>
            <span>Số lượng còn: {product.quantity}</span> |
            <span>Đã bán: {product.sold}</span> |
            <span style={{ color: "#2563eb" }}>
              Hãng: {product.factory || "Unknown"}
            </span>
          </div>

          <div className="price-box">
            <span className="detail-price">
              {formatCurrency(product.price)}
            </span>
            <span className="stock-status">CÒN HÀNG</span>
          </div>

          <div className="specs-text">
            {product.description ||
              "Core i5-12450H, 16 GB, SSD 512GB, RTX 3050 4GB, 15.6 inch Full HD, Like New"}
          </div>

          <div className="policy-list">
            <div className="policy-item">
              <FaTruck className="policy-icon" /> Miễn phí vận chuyển
            </div>
            <div className="policy-item">
              <FaShieldAlt className="policy-icon" /> Bảo hành 12 tháng
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-buy-now" onClick={() => addToCart(product)}>
              <FaCartPlus /> THÊM VÀO GIỎ
            </button>
          </div>
        </div>
      </div>

      <div className="product-description-section">
        <h3 className="desc-heading">Mô tả chi tiết sản phẩm</h3>
        <p style={{ lineHeight: "1.6", color: "#444", whiteSpace: "pre-line" }}>
          {product.detail_desc
            ? product.detail_desc
            : product.description || "Thông tin chi tiết đang được cập nhật..."}
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
