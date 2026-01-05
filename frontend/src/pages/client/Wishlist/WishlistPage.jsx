import React from "react";
import { FaTrash, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../../context/WishlistContext";
import { useCart } from "../../../context/CartContext";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./WishlistPage.css";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleBuyNow = (product) => {
    addToCart(product);

    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <div style={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Header />

      <div className="wishlist-container">
        <div className="wishlist-header">
          <div className="wishlist-title">
            <FaHeart style={{ color: "#ff4757" }} /> Danh sách yêu thích
          </div>

          {wishlistItems.length > 0 && (
            <button className="btn-clear-all" onClick={clearWishlist}>
              <FaTrash /> Xóa tất cả
            </button>
          )}
        </div>

        <div className="wishlist-content">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <div className="wishlist-item" key={item.id}>
                <img
                  src={
                    item.image
                      ? `http://localhost:8000/uploads/${item.image}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={item.name}
                  className="wishlist-img"
                  onClick={() => navigate(`/products/${item.id}`)}
                />

                <div className="wishlist-info">
                  <div
                    className="wishlist-name"
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    {item.name}
                  </div>
                  <div className="wishlist-price">
                    {formatCurrency(item.price)}
                  </div>
                </div>

                <div className="wishlist-actions">
                  <button
                    className="btn-buy-now"
                    onClick={() => handleBuyNow(item)}
                  >
                    <FaShoppingCart /> Thêm vào giỏ hàng
                  </button>

                  <button
                    className="btn-remove-item"
                    onClick={() => removeFromWishlist(item.id)}
                    title="Xóa khỏi yêu thích"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-wishlist">
              <p>Danh sách yêu thích của bạn đang trống.</p>
              <button
                className="btn-buy-now"
                style={{ margin: "20px auto", width: "fit-content" }}
                onClick={() => navigate("/")}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WishlistPage;
