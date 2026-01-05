import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // --- CHỐT CHẶN AN TOÀN ---
    // Nếu không có Token (Guest/Vừa logout) -> Luôn trả về giỏ hàng rỗng
    if (!localStorage.getItem("token")) return [];
    // -------------------------

    const savedCart = localStorage.getItem("cartItems");
    try {
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    // Chỉ lưu giỏ hàng nếu ĐANG CÓ token (đang đăng nhập)
    // Để tránh trường hợp logout rồi mà vẫn lưu đè dữ liệu rỗng lên
    if (localStorage.getItem("token")) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product) => {
    const maxStock = product.quantity;

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity + 1 > existingItem.maxStock) {
          alert(
            `Số lượng sản phẩm trong kho chỉ còn ${existingItem.maxStock} cái!`
          );
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, maxStock: maxStock }];
    });

    // Thông báo nhỏ
    // alert("Đã thêm vào giỏ!");
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty > item.maxStock) {
            alert(`Kho chỉ còn ${item.maxStock} sản phẩm.`);
            return item;
          }
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  const updateCartItemQuantity = (id, value) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let newQty = parseInt(value);
          if (isNaN(newQty) || newQty <= 0) newQty = 1;
          if (newQty > item.maxStock) {
            alert(`Kho chỉ còn ${item.maxStock} sản phẩm.`);
            newQty = item.maxStock;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateCartItemQuantity,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
