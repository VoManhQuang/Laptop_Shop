import React, { useContext } from "react";
import { FaUserShield, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const AdminHeader = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-header">
      <div
        className="header-right"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "15px",
        }}
      >
        <div
          className="admin-info"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <span style={{ fontWeight: "600", color: "#333", fontSize: "14px" }}>
            {user ? user.fullName : "Administrator"}
          </span>
          <FaUserShield size={20} color="#3b82f6" />
        </div>

        <div style={{ height: "20px", width: "1px", background: "#ddd" }}></div>

        <button
          className="logout-btn"
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            height: "32px",
            fontSize: "13px",
            padding: "0 10px",
          }}
        >
          <FaSignOutAlt /> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
