import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const {pathname} = location;
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
          <Link
            to="/"
            className={`nav-item ${pathname === "/" ? "active" : ""}`}
          >
            Trang chủ
          </Link>

          <Link
            to="/products"
            className={`nav-item ${pathname.startsWith("/products") ? "active" : ""}`}
          >
            Sản phẩm
          </Link>

          <Link
            to="/categories"
            className={`nav-item ${pathname.startsWith("/categories") ? "active" : ""}`}
          >
            Danh mục <span className="arrow-down">▼</span>
          </Link>

          <Link
            to="/about"
            className={`nav-item ${pathname === "/about" ? "active" : ""}`}
          >
            Giới thiệu
          </Link>

          <Link
            to="/contact"
            className={`nav-item ${pathname === "/contact" ? "active" : ""}`}
          >
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
