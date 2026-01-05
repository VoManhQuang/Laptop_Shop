import React, { useState, useEffect } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import {
  FaUser,
  FaKey,
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { userApi } from "../../../services/api";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("info");

  // --- STATE CHO TAB THÔNG TIN ---
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    avatar: null,
    newAvatarFile: null,
  });

  // --- STATE CHO TAB ĐỔI MẬT KHẨU (MỚI) ---
  const [passData, setPassData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // --- LOGIC TAB THÔNG TIN ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.getProfile();
        const user = res.data;

        setFormData({
          fullName: user.fullName || user.full_name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          avatar: user.avatar || null,
          newAvatarFile: null,
        });
      } catch (error) {
        console.error("Lỗi tải thông tin:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        newAvatarFile: file,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const dataToSend = new FormData();
      dataToSend.append("fullName", formData.fullName);
      dataToSend.append("phone", formData.phone);
      dataToSend.append("address", formData.address);

      const fileInput = document.getElementById("file-upload");
      if (fileInput && fileInput.files[0]) {
        dataToSend.append("file", fileInput.files[0]);
      }

      const res = await userApi.updateProfile(dataToSend);
      alert("✅ Cập nhật thông tin thành công!");
      const updatedUser = res.data;
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const newUserLocal = {
        ...currentUser,
        full_name: updatedUser.full_name,
        fullName: updatedUser.full_name,
        avatar: updatedUser.avatar,
      };
      localStorage.setItem("user", JSON.stringify(newUserLocal));
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("❌ Cập nhật thất bại!");
    }
  };

  // --- LOGIC TAB ĐỔI MẬT KHẨU (MỚI) ---
  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  const toggleShow = (field) => {
    setShowPass({ ...showPass, [field]: !showPass[field] });
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (passData.new_password !== passData.confirm_password) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp!" });
      return;
    }

    try {
      await userApi.changePassword(passData);
      setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
      setPassData({ old_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      console.error(error); // Log ra để xem lỗi gì

      // --- ĐOẠN CODE SỬA LỖI Ở ĐÂY ---
      let errorMsg = "Đổi mật khẩu thất bại";

      const detail = error.response?.data?.detail;

      if (detail) {
        if (typeof detail === "string") {
          // Trường hợp lỗi 400 trả về chuỗi (ví dụ: "Mật khẩu cũ không đúng")
          errorMsg = detail;
        } else if (Array.isArray(detail)) {
          // Trường hợp lỗi 422 trả về mảng (ví dụ: Mật khẩu ngắn quá)
          // Lấy tin nhắn lỗi của phần tử đầu tiên
          errorMsg = detail[0].msg;
        }
      }

      setMessage({
        type: "error",
        text: errorMsg,
      });
      // -------------------------------
    }
  };

  // --- HELPER ---
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  // Xử lý hiển thị avatar (tránh lỗi link facebook/google)
  const getAvatarUrl = (avatarName) => {
    if (!avatarName) return null;
    if (avatarName.startsWith("http")) return avatarName;
    return `http://localhost:8000/uploads/${avatarName}`;
  };

  const previewAvatar = formData.newAvatarFile
    ? URL.createObjectURL(formData.newAvatarFile)
    : getAvatarUrl(formData.avatar);

  return (
    <div className="profile-page-container">
      <Header />

      <div className="profile-content">
        <div className="page-header-title">
          <h1>Tài khoản của tôi</h1>
          <div className="breadcrumb">Trang chủ / Tài khoản</div>
        </div>

        <div className="profile-wrapper">
          {/* Banner */}
          <div className="profile-banner">
            <div className="avatar-circle">
              {previewAvatar ? (
                <img
                  src={previewAvatar}
                  alt="Avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                getInitials(formData.fullName)
              )}
            </div>
            <div className="profile-name">{formData.fullName}</div>
            <div className="profile-email">{formData.email}</div>
          </div>

          <div className="profile-tabs">
            <div
              className={`tab-item ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              <FaUser /> Thông tin cá nhân
            </div>
            <div
              className={`tab-item ${activeTab === "password" ? "active" : ""}`}
              onClick={() => setActiveTab("password")}
            >
              <FaKey /> Đổi mật khẩu
            </div>
          </div>

          <div className="profile-body">
            {/* --- TAB INFO --- */}
            {activeTab === "info" && (
              <>
                <div className="form-section-title">Thông tin cơ bản</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Họ và tên <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Email <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      disabled
                    />
                    <div className="form-note">Email không thể thay đổi</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ảnh đại diện</label>
                    <div className="file-input-wrapper">
                      <label htmlFor="file-upload" className="file-btn">
                        Chọn tệp
                      </label>
                      <div className="file-name-display">
                        {formData.newAvatarFile
                          ? formData.newAvatarFile.name
                          : formData.avatar || "Chưa chọn tệp"}
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Địa chỉ</label>
                    <textarea
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
                <div className="btn-group">
                  <button className="btn-save" onClick={handleUpdate}>
                    <FaSave /> Cập nhật thông tin
                  </button>
                  <button className="btn-cancel">
                    <FaTimes /> Hủy
                  </button>
                </div>
              </>
            )}

            {/* --- TAB PASSWORD (MỚI) --- */}
            {activeTab === "password" && (
              <form
                onSubmit={handleSubmitPassword}
                className="password-form-container"
              >
                <div className="form-section-title">Đổi mật khẩu</div>

                {/* Mật khẩu hiện tại */}
                <div className="form-group">
                  <label className="form-label">
                    Mật khẩu hiện tại <span className="red">*</span>
                  </label>
                  <div className="input-wrapper-pass">
                    <input
                      type={showPass.old ? "text" : "password"}
                      className="form-control"
                      name="old_password"
                      placeholder="Nhập mật khẩu hiện tại"
                      value={passData.old_password}
                      onChange={handlePassChange}
                      required
                    />
                    <span
                      className="eye-icon"
                      onClick={() => toggleShow("old")}
                    >
                      {showPass.old ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                {/* Mật khẩu mới */}
                <div className="form-group">
                  <label className="form-label">
                    Mật khẩu mới <span className="red">*</span>
                  </label>
                  <div className="input-wrapper-pass">
                    <input
                      type={showPass.new ? "text" : "password"}
                      className="form-control"
                      name="new_password"
                      placeholder="Nhập mật khẩu mới"
                      value={passData.new_password}
                      onChange={handlePassChange}
                      required
                    />
                    <span
                      className="eye-icon"
                      onClick={() => toggleShow("new")}
                    >
                      {showPass.new ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <div className="form-note">
                    Mật khẩu phải có ít nhất 6 ký tự
                  </div>
                </div>

                {/* Xác nhận mật khẩu mới */}
                <div className="form-group">
                  <label className="form-label">
                    Xác nhận mật khẩu mới <span className="red">*</span>
                  </label>
                  <div className="input-wrapper-pass">
                    <input
                      type={showPass.confirm ? "text" : "password"}
                      className="form-control"
                      name="confirm_password"
                      placeholder="Nhập lại mật khẩu mới"
                      value={passData.confirm_password}
                      onChange={handlePassChange}
                      required
                    />
                    <span
                      className="eye-icon"
                      onClick={() => toggleShow("confirm")}
                    >
                      {showPass.confirm ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                {/* Thông báo */}
                {message.text && (
                  <div className={`alert-msg ${message.type}`}>
                    {message.text}
                  </div>
                )}

                <div className="btn-group">
                  <button type="submit" className="btn-save">
                    <FaKey /> Đổi mật khẩu
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() =>
                      setPassData({
                        old_password: "",
                        new_password: "",
                        confirm_password: "",
                      })
                    }
                  >
                    Đặt lại
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
