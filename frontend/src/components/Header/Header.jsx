import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaShoppingBag,
  FaUser,
  FaUserCircle,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Header.css";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const Header = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const handleLogout = () => {
    alert("Đã đăng xuất!");
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="logo" onClick={() => navigate("/")}>
          <span className="logo-text">Laptop</span>{" "}
          <span className="logo-bold">Shop</span>
        </div>

        <nav className="nav-menu">
          <Link to="/" className="nav-item active">
            Trang chủ
          </Link>
          <Link to="/products" className="nav-item">
            Sản phẩm
          </Link>
          <div className="nav-item">
            Danh mục <span className="arrow-down">▼</span>
          </div>
          <Link to="/about" className="nav-item">
            Giới thiệu
          </Link>
          <Link to="/contact" className="nav-item">
            Liên hệ
          </Link>
        </nav>

        <div className="user-actions">
          <div
            className="icon-wrapper"
            onClick={() => navigate("/wishlist")}
            style={{ cursor: "pointer" }}
          >
            <FaHeart className="icon" />
            {wishlistItems.length > 0 && (
              <span className="header-badge">{wishlistItems.length}</span>
            )}
          </div>

          <div className="icon-wrapper" onClick={() => navigate("/cart")}>
            <FaShoppingBag className="icon" />
            <span className="header-badge">{cartCount}</span>
          </div>

          <div className="user-dropdown-container">
            <div
              className="user-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <FaUser />
            </div>

            {isUserMenuOpen && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => navigate("/profile")}
                >
                  <FaUserCircle className="dropdown-icon" /> Thông tin cá nhân
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => navigate("/history")}
                >
                  <FaHistory className="dropdown-icon" /> Lịch sử đơn hàng
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  <FaSignOutAlt className="dropdown-icon" /> Đăng xuất
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
