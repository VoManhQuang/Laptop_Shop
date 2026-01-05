import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userApi } from "../../../services/api";
import "./CreateUser.css";

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      const res = await userApi.getById(id);
      setUser(res.data);

      if (res.data.avatar) {
        setPreview(`http://localhost:8000/uploads/${res.data.avatar}`);
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin user:", error);
      alert("Không tìm thấy người dùng!");
      navigate("/admin/users");
    }
  };

  if (!user) return <div style={{ padding: "20px" }}>Đang tải dữ liệu...</div>;

  return (
    <div className="create-user-container">
      <div className="header-actions">
        <div>
          <h2>Chi tiết người dùng</h2>
          <span className="breadcrumb">Dashboard / Users / View Details</span>
        </div>
        <button className="btn-back" onClick={() => navigate("/admin/users")}>
          Quay lại
        </button>
      </div>

      <form className="create-form">
        <div className="form-row">
          <div className="form-group">
            <label>ID</label>
            <input
              type="text"
              value={user.id}
              disabled
              style={{ background: "#f1f1f1" }}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={user.email} disabled />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone number</label>
            <input type="text" value={user.phone || "Trống"} disabled />
          </div>
          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              value={user.fullName || user.full_name}
              disabled
            />
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input type="text" value={user.address || "Trống"} disabled />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Role</label>
            <select value={user.role_id} disabled>
              <option value="1">ADMIN</option>
              <option value="2">USER</option>
            </select>
          </div>

          <div className="preview-section" style={{ marginTop: 0, flex: 1 }}>
            <label>Avatar</label>
            <div className="img-preview-box">
              {preview ? (
                <img src={preview} alt="Avatar" />
              ) : (
                <span>No Avatar</span>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ViewUser;
