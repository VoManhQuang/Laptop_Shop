import React, { useEffect, useState } from "react";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { userApi } from "../../../services/api";
import "./ManageUser.css";
import { useNavigate } from "react-router-dom";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAll();
      console.log("Data user:", res.data);
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await userApi.delete(id);
        alert("Xóa thành công!");
        fetchUsers();
      } catch (error) {
        console.error("Lỗi xóa user:", error);
        alert("Xóa thất bại! Có thể user này đang có đơn hàng.");
      }
    }
  };

  return (
    <div className="manage-user-container">
      <div className="title-section">
        <h2>Danh sách người dùng</h2>
        <button
          className="btn-create"
          onClick={() => navigate("/admin/users/create")}
        >
          <FaPlus /> Tạo mới
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Đang tải dữ liệu...
        </p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Họ và tên</th>
              <th>Địa chỉ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "---"}</td>

                  <td>{user.fullName || user.full_name}</td>

                  <td>{user.address || "---"}</td>
                  <td>
                    <button
                      className="action-btn view"
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => navigate(`/admin/users/update/${user.id}`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Chưa có người dùng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUser;
