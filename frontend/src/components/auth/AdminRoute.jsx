import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role_id !== 1) {
    alert("Bạn không có quyền truy cập vào trang Admin!");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
