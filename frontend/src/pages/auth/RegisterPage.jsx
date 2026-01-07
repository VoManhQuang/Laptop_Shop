import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../services/api";
import "./Auth.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    if (!fullName || fullName.length < 2) {
      alert("Họ tên phải có ít nhất 2 ký tự!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      alert("Số điện thoại phải gồm đúng 10 chữ số!");
      return;
    }

    if (!formData.email.trim().endsWith('@gmail.com')) {
      alert("Email phải có đuôi @gmail.com!");
      return;
    }

    const payload = {
      email: formData.email.trim(),
      password: formData.password,
      full_name: fullName,
      phone: formData.phone.trim(),
      address: "",
    };

    try {
      await authApi.register(payload);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(
        "Đăng ký thất bại: " + (error.response?.data?.detail || "Lỗi server")
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box register">
        <div className="auth-header">
          <div className="auth-icon">R</div>
          <div className="auth-title">
            <h2>Đăng ký</h2>
            <p>Tạo tài khoản mới để tiếp tục</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>First name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Last name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@gmail.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0123456789"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="......"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-auth">
            Đăng ký
          </button>
        </form>

        <div className="auth-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
