import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useCart } from "@/context/CartContext";

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const momo_ResultCode = searchParams.get("resultCode");
    const orderId =
      searchParams.get("vnp_TxnRef") || searchParams.get("orderId");

    let success = false;
    if (vnp_ResponseCode === "00" || momo_ResultCode === "0") {
      success = true;
    }

    if (success) {
      // Thanh toán thành công
      clearCart();
      alert("🎉 Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.");
      navigate("/");
    } else {
      // Thanh toán thất bại
      alert("❌ Thanh toán thất bại! Vui lòng thử lại.");
      navigate("/checkout");
    }
  }, [searchParams, navigate, clearCart]);

  return (
    <div>
      <Header />
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Đang xử lý kết quả thanh toán...</h2>
        <p>Vui lòng chờ trong giây lát.</p>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentReturn;
