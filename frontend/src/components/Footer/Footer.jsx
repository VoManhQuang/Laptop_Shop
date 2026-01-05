import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-col">
          <div className="footer-logo">
            <span className="logo-text">Laptop</span>
            <span className="logo-bold">Shop</span>
          </div>
          <p className="footer-desc">
            Cung cấp laptop chính hãng và linh kiện công nghệ chất lượng cao.
          </p>
        </div>

        <div className="footer-col">
          <h3>Sản phẩm</h3>
          <ul className="footer-links">
            <li>
              <a href="#">Laptop Gaming</a>
            </li>
            <li>
              <a href="#">Laptop Văn phòng</a>
            </li>
            <li>
              <a href="#">Phụ kiện</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Hỗ trợ</h3>
          <ul className="footer-links">
            <li>
              <a href="#">Chính sách bảo hành</a>
            </li>
            <li>
              <a href="#">Chính sách đổi trả</a>
            </li>
            <li>
              <a href="#">Hướng dẫn mua hàng</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Liên hệ</h3>
          <ul className="footer-contact">
            <li>
              <FaMapMarkerAlt /> <span>TP. Đà Nẵng</span>
            </li>
            <li>
              <FaPhoneAlt /> <span>1900 1234</span>
            </li>
            <li>
              <FaEnvelope /> <span>support@laptopshop.vn</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; 2025 LaptopShop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
