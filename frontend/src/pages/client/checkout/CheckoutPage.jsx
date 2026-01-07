import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { useCart } from "../../../context/CartContext";
import { orderApi, paymentApi } from "../../../services/api";
import {
  FaTruck,
  FaUser,
  FaPhoneAlt,
  FaMoneyBillWave,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Giỏ hàng đang trống! Vui lòng chọn sản phẩm.");
      return;
    }

    const userStored = localStorage.getItem("user");
    const user = userStored ? JSON.parse(userStored) : null;
    const userId = user ? user.id : null;

    const orderData = {
      total_price: totalAmount,
      receiver_name: formData.fullName,
      receiver_phone: formData.phone,
      receiver_address: formData.address,
      status:
        paymentMethod === "VNPAY" || paymentMethod === "MOMO"
          ? "PENDING"
          : "PAID", // Nếu online payment thì pending, chờ thanh toán
      user_id: userId,

      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      console.log("Đang gửi đơn hàng:", orderData); // Log để kiểm tra
      const response = await orderApi.createOrder(orderData);
      const orderId = response.data.id;

      if (paymentMethod === "VNPAY" || paymentMethod === "MOMO") {
        // Tạo URL thanh toán
        const paymentResponse = await paymentApi.createPaymentUrl(
          orderId,
          paymentMethod
        );
        const paymentUrl = paymentResponse.data.payment_url;
        // Redirect đến payment gateway
        window.location.href = paymentUrl;
      } else {
        // COD
        alert("🎉 Đặt hàng thành công");
        clearCart();
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("❌ Đặt hàng thất bại! Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="checkout-container">
      <Header />

      <div className="breadcrumb-nav">
        Trang chủ <span>/</span> Giỏ hàng <span>/</span>{" "}
        <strong>Thanh toán</strong>
      </div>

      <div className="steps-indicator">
        <div className="step-item active">
          <div className="step-circle">
            <FaCheckCircle />
          </div>{" "}
          Giỏ hàng
        </div>
        <div className="step-line active"></div>
        <div className="step-item active">
          <div className="step-circle">2</div> Thông tin
        </div>
        <div className="step-line"></div>
        <div className="step-item">
          <div className="step-circle">3</div> Hoàn tất
        </div>
      </div>

      <div className="checkout-content">
        <form className="checkout-left" onSubmit={handlePlaceOrder}>
          <div className="section-box">
            <div className="section-header">
              <FaTruck /> Thông tin giao hàng
            </div>
            <div className="section-body">
              <div className="form-group">
                <label className="form-label">
                  Tên người nhận <span className="required">*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <FaUser
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "12px",
                      color: "#999",
                    }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên người nhận"
                    style={{ paddingLeft: "35px" }}
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Số điện thoại <span className="required">*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <FaPhoneAlt
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "12px",
                      color: "#999",
                      fontSize: "13px",
                    }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập số điện thoại"
                    style={{ paddingLeft: "35px" }}
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Địa chỉ giao hàng <span className="required">*</span>
                </label>
                <textarea
                  className="form-control"
                  placeholder="Nhập địa chỉ chi tiết: Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="section-box">
            <div
              className="section-header"
              style={{ backgroundColor: "#4338ca" }}
            >
              <FaMoneyBillWave /> Phương thức thanh toán
            </div>
            <div className="section-body">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <div className="payment-label">
                    Thanh toán khi nhận hàng (COD)
                  </div>
                  <div style={{ fontSize: "13px", color: "#666" }}>
                    Thanh toán tiền mặt khi nhận hàng
                  </div>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="VNPAY"
                  checked={paymentMethod === "VNPAY"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <div className="payment-label">Thanh toán qua VNPay</div>
                  <div style={{ fontSize: "13px", color: "#666" }}>
                    Thanh toán trực tuyến an toàn qua VNPay
                  </div>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="MOMO"
                  checked={paymentMethod === "MOMO"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <div className="payment-label">Thanh toán qua MoMo</div>
                  <div style={{ fontSize: "13px", color: "#666" }}>
                    Thanh toán nhanh qua ví MoMo
                  </div>
                </div>
              </label>

              <div className="secure-badge">
                <FaShieldAlt /> Giao dịch an toàn & bảo mật. Thông tin của bạn
                được mã hóa.
              </div>
            </div>
          </div>

          <button type="submit" className="btn-complete">
            <FaCheckCircle /> Hoàn tất đặt hàng
          </button>
        </form>

        <div className="checkout-right">
          <div className="section-box">
            <div className="order-header">🧾 Đơn hàng của bạn</div>
            <div className="section-body">
              {/* Danh sách sản phẩm */}
              <div className="order-list">
                {cartItems.map((item) => (
                  <div className="order-item" key={item.id}>
                    <div className="order-item-info">
                      <img
                        src={
                          item.image
                            ? `http://localhost:8000/uploads/${item.image}`
                            : "https://via.placeholder.com/50"
                        }
                        alt={item.name}
                        className="order-thumb"
                      />
                      <div>
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-qty">x {item.quantity}</div>
                      </div>
                    </div>
                    <div className="order-item-price">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span style={{ color: "#059669", fontWeight: "bold" }}>
                  Miễn phí
                </span>
              </div>

              <div className="summary-total">
                <span>Tổng cộng:</span>
                <span className="total-price">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
