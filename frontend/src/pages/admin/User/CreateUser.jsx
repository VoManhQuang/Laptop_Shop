import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../../services/api";
import "./CreateUser.css";

const CreateUser = () => {
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
  const [preview, setPreview] = useState(null);

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

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email.";
      isValid = false;
    } else if (!formData.email.endsWith("@gmail.com")) {
      newErrors.email = "Email bắt buộc phải có đuôi ...@gmail.com";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
      isValid = false;
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone =
          "Số điện thoại không hợp lệ (Phải đúng 10 số, không chữ).";
        isValid = false;
      }
    }

    if (!formData.fullName) {
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
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("fullName", formData.fullName);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("role_id", formData.role_id);
    if (avatar) {
      data.append("file", avatar);
    }

    try {
      await userApi.create(data); //
      alert("Tạo người dùng thành công!");
      navigate("/admin/users");
    } catch (error) {
      console.error(error);
      const errorDetail = error.response?.data?.detail;

      if (errorDetail === "Email đã tồn tại") {
        setErrors({ email: "Email này đã được sử dụng bởi người khác." });
      } else if (errorDetail === "Số điện thoại đã tồn tại") {
        setErrors({ phone: "Số điện thoại này đã có trong hệ thống." });
      } else {
        alert("Lỗi: " + (errorDetail || "Có lỗi xảy ra"));
      }
    }
  };

  return (
    <div className="create-user-container">
      <div className="header-actions">
        <div>
          <h2>Thêm người dùng</h2>
          <span className="breadcrumb">Dashboard / Users / Create</span>
        </div>
        <button className="btn-back" onClick={() => navigate("/admin/users")}>
          Quay lại
        </button>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-row">
          {/* EMAIL */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tối thiểu 6 ký tự"
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone number</label>
            <input
              type="text"
              name="phone"
              placeholder="Ví dụ: 0901234567"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>

          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? "input-error" : ""}
            />
            {errors.fullName && (
              <span className="error-message">{errors.fullName}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={formData.address}
            onChange={handleChange}
          />
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
            <label>Avatar (chọn ảnh)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
          </div>
        </div>

        <div className="preview-section">
          <label>Xem trước Avatar</label>
          <div className="img-preview-box">
            {preview ? (
              <img src={preview} alt="Preview" />
            ) : (
              <span>No Image</span>
            )}
          </div>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn-submit">
            Submit
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

export default CreateUser;
