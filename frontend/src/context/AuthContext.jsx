import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    // 1. Xóa sạch dữ liệu trong LocalStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("wishlist");

    // 2. QUAN TRỌNG: Không gọi setUser(null) ở đây nữa!
    // Để tránh React render lại và vô tình lưu ngược Cart cũ vào LocalStorage.
    // Việc reload trang bên dưới sẽ tự động làm sạch State.

    // 3. Tải lại trang ngay lập tức
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
