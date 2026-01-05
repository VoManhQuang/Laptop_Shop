import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi, userApi } from "../../services/api"; // Đảm bảo đã thêm hàm loginSocial trong api.js chưa nhé
import { AuthContext } from "../../context/AuthContext";
import "./Auth.css";

// --- IMPORT FIREBASE ---
import { signInWithPopup } from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../../firebase/firebase.config";
import { FaFacebook, FaGoogle } from "react-icons/fa"; // Cài react-icons nếu chưa có

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // --- HÀM XỬ LÝ ĐĂNG NHẬP THƯỜNG ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await authApi.login(email, password);
      // ... code cũ giữ nguyên
      const token = res.data.access_token;
      localStorage.setItem("token", token);

      // Có thể lấy user profile ngay từ res.data.user của API login mới (nếu bạn update api login trả về user)
      // Hoặc gọi userApi.getProfile() như cũ
      const userRes = await userApi.getProfile();
      const userData = userRes.data;

      login(userData, token);
      alert("Đăng nhập thành công!");
      if (userData.role_id === 1) navigate("/admin");
      else navigate("/");
    } catch (err) {
      console.error(err);
      setError("Email hoặc mật khẩu không chính xác!");
    }
  };

  // --- HÀM XỬ LÝ SOCIAL LOGIN (MỚI) ---
  const handleSocialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 1. MẶC ĐỊNH LẤY PHOTO URL TỪ FIREBASE
      let avatarUrl = user.photoURL;

      // 2. NẾU LÀ FACEBOOK -> THÊM THAM SỐ ĐỂ LẤY ẢNH TO RÕ (QUAN TRỌNG)
      if (provider === facebookProvider) {
        // Thêm ?height=500 vào đuôi để lấy ảnh kích thước 500px
        avatarUrl = user.photoURL + "?height=500";
      }

      // 3. GỌI API BACKEND VỚI AVATAR MỚI
      const res = await authApi.socialLogin({
        email: user.email,
        full_name: user.displayName,
        avatar: avatarUrl, // <--- Dùng biến avatarUrl đã xử lý ở trên
        provider: provider === googleProvider ? "google" : "facebook",
        provider_id: user.uid,
      });

      // ... (Phần lưu token và navigate giữ nguyên như cũ) ...
      const token = res.data.access_token;
      localStorage.setItem("token", token);

      const userData = res.data.user;
      login(userData, token);

      alert(
        `Đăng nhập ${
          provider === googleProvider ? "Google" : "Facebook"
        } thành công!`
      );

      if (userData.role_id === 1) navigate("/admin");
      else navigate("/");
    } catch (err) {
      console.error("Social Login Error:", err);
      setError("Lỗi đăng nhập mạng xã hội!");
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <div className="auth-icon">R</div>
          <div className="auth-title">
            <h2>Đăng nhập</h2>
            <p>Nhập email và password để tiếp tục</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          {/* ... Form input cũ giữ nguyên ... */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="......"
              required
            />
          </div>

          {error && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn-auth">
            Đăng nhập
          </button>
        </form>

        {/* --- KHU VỰC SOCIAL BUTTON --- */}
        <div className="social-login">
          <p style={{ textAlign: "center", margin: "15px 0", color: "#666" }}>
            Hoặc đăng nhập bằng
          </p>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <button
              type="button"
              className="btn-social google"
              onClick={() => handleSocialLogin(googleProvider)}
              style={{
                background: "#db4437",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <FaGoogle /> Google
            </button>

            <button
              type="button"
              className="btn-social facebook"
              onClick={() => handleSocialLogin(facebookProvider)}
              style={{
                background: "#4267B2",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <FaFacebook /> Facebook
            </button>
          </div>
        </div>
        {/* ----------------------------- */}

        <div className="auth-footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
