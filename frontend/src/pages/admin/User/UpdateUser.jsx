import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userApi } from "../../../services/api";
import "./CreateUser.css";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
    role_id: "2",
  });

  const [errors, setErrors] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const res = await userApi.getById(id);
      const data = res.data;
      setFormData({
        email: data.email,
        password: "",
        fullName: data.fullName || data.full_name,
        phone: data.phone || "",
        address: data.address || "",
        role_id: data.role_id,
      });
      if (data.avatar) {
        setCurrentAvatar(`http://localhost:8000/uploads/${data.avatar}`);
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi tải dữ liệu user!");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (formData.password && formData.password.length > 0) {
      if (formData.password.length < 6) {
        newErrors.password = "Mật khẩu mới phải có ít nhất 6 ký tự.";
        isValid = false;
      }
    }

    if (formData.phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Số điện thoại phải bao gồm đúng 10 chữ số.";
        isValid = false;
      }
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("role_id", formData.role_id);

    if (formData.password) {
      data.append("password", formData.password);
    }

    if (avatar) {
      data.append("file", avatar);
    }

    try {
      await userApi.update(id, data);
      alert("Cập nhật thành công!");
      navigate("/admin/users");
    } catch (error) {
      console.error(error);
      alert(
        "Cập nhật thất bại: " + (error.response?.data?.detail || "Lỗi server")
      );
    }
  };

  return (
    <div className="create-user-container">
      <div className="header-actions">
        <div>
          <h2>Cập nhật người dùng</h2>
          <span className="breadcrumb">Dashboard / Users / Update</span>
        </div>
        <button className="btn-back" onClick={() => navigate("/admin/users")}>
          Quay lại
        </button>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>ID</label>
            <input
              type="text"
              value={id}
              disabled
              style={{ background: "#f1f1f1" }}
            />
          </div>
          <div className="form-group">
            <label>Email (Không thể sửa)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              style={{ background: "#e9ecef", cursor: "not-allowed" }}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Password (Để trống nếu không đổi)</label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu mới..."
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>
          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className={errors.fullName ? "input-error" : ""}
            />
            {errors.fullName && (
              <span className="error-message">{errors.fullName}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Role</label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
            >
              <option value="1">ADMIN</option>
              <option value="2">USER</option>
            </select>
          </div>

          <div className="form-group">
            <label>Thay đổi Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
          </div>
        </div>

        <div className="preview-section">
          <label>Avatar hiện tại / Mới</label>
          <div className="img-preview-box">
            {preview ? (
              <img src={preview} alt="New Preview" />
            ) : currentAvatar ? (
              <img src={currentAvatar} alt="Current" />
            ) : (
              <span>No Avatar</span>
            )}
          </div>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn-submit">
            Lưu thay đổi
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/users")}
          >
            Hủy
          </button>
        </div>
      </form>

      <style>{`
        .error-message {
          color: red;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }
        .input-error {
          border: 1px solid red !important;
        }
      `}</style>
    </div>
  );
};

export default UpdateUser;
