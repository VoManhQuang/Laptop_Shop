import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import {
  FaTrash,
  FaArrowLeft,
  FaCreditCard,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import "./CartPage.css";
import { useCart } from "../../../context/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    updateCartItemQuantity,
    clearCart,
  } = useCart();
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Hàm format tiền
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Hàm thay đổi số lượng
  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?"))
      removeFromCart(id);
  };

  const handleClearCart = () => {
    if (window.confirm("Xóa toàn bộ giỏ hàng?")) clearCart();
  };

  return (
    <div className="cart-page-container">
      <Header />

      <div className="breadcrumb-nav">
        Trang chủ <span>/</span> <strong>Giỏ hàng</strong>
      </div>

      <div className="cart-content">
        <div className="cart-header">
          <h2 className="cart-title">Giỏ hàng của bạn</h2>
          {cartItems.length > 0 && (
            <button className="btn-clear-all" onClick={handleClearCart}>
              <FaTrash /> Xóa tất cả
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png"
              alt="Empty Cart"
              style={{ width: "200px" }}
            />
            <p>Giỏ hàng của bạn đang trống!</p>
            <button
              className="btn-continue"
              onClick={() => navigate("/")}
              style={{ margin: "20px auto" }}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="cart-product-info">
                        <img
                          src={
                            item.image
                              ? `http://localhost:8000/uploads/${item.image}`
                              : "https://via.placeholder.com/80"
                          }
                          alt={item.name}
                          className="cart-img"
                        />
                        <div className="cart-product-details">
                          <h4>{item.name}</h4>
                          <div className="cart-product-desc">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="price-blue">{formatCurrency(item.price)}</td>
                    <td>
                      <div className="qty-group">
                        {/* Nút TRỪ */}
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <FaMinus size={10} />
                        </button>

                        <input
                          type="number"
                          className="qty-input"
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartItemQuantity(item.id, e.target.value)
                          }
                          onBlur={(e) => {
                            if (
                              !e.target.value ||
                              parseInt(e.target.value) <= 0
                            ) {
                              updateCartItemQuantity(item.id, 1);
                            }
                          }}
                        />

                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                    </td>
                    <td className="price-total">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                    <td>
                      <button
                        className="btn-remove"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <FaTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-summary">
              <div className="total-label">
                <FaCreditCard /> Tổng cộng:
                <span className="total-amount-large">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              <div className="cart-actions">
                <button className="btn-continue" onClick={() => navigate("/")}>
                  <FaArrowLeft /> Tiếp tục mua sắm
                </button>
                <button
                  className="btn-checkout"
                  onClick={() => navigate("/checkout")}
                >
                  <FaCreditCard /> Thanh toán
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
