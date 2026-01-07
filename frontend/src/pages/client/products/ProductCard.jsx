import React from "react";
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../../context/WishlistContext";
import { useCart } from "../../../context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product, showCart = true }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const goDetail = () => {
    navigate(`/products/${product.id}`);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  return (
    <div className="product-card">
      {/* Wishlist */}
      <div
        className={`btn-wishlist ${isInWishlist(product.id) ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
          alert(
            isInWishlist(product.id)
              ? "Đã xóa khỏi yêu thích"
              : "Đã thêm vào yêu thích"
          );
        }}
      >
        <FaHeart />
      </div>

      {/* Image */}
      <img
        src={
          product.image
            ? `http://localhost:8000/uploads/${product.image}`
            : "https://via.placeholder.com/200"
        }
        alt={product.name}
        className="product-img"
        onClick={goDetail}
        style={{ cursor: "pointer" }}
      />

      <div className="product-info">
        <div
          className="product-name"
          onClick={goDetail}
          style={{ cursor: "pointer" }}
        >
          {product.name}
        </div>

        <div className="rating">
          <FaStar /><FaStar /><FaStar /><FaStar />
          <FaStar className="star-muted" /> (4.0)
        </div>

        <div className="product-price">
          {formatCurrency(product.price)}
        </div>

        {showCart && (
          <button
            className="btn-add-cart"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
              alert("Đã thêm vào giỏ hàng");
            }}
          >
            <FaShoppingCart /> Thêm vào giỏ hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
