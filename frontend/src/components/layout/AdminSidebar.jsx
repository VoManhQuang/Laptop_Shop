import React from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
} from "react-icons/fa";
import "./AdminLayout.css";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-brand">
        <Link to="/" style={{ textDecoration: "none", color: "#fff" }}>
          <div
            className="sidebar-brand-text mx-3"
            style={{
              fontSize: "1.5rem",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1px",
              cursor: "pointer",
            }}
          >
            LaptopShop
          </div>
        </Link>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaTachometerAlt className="icon" /> Thống kê
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaUsers className="icon" /> Người dùng
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaBoxOpen className="icon" /> Sản phẩm
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaShoppingCart className="icon" /> Đơn hàng
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
