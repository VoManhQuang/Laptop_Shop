import React, { createContext, useState, useContext, useEffect } from "react";
import { cartApi } from "../services/api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load giỏ hàng khi component mount hoặc khi đăng nhập
  const loadCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Chưa đăng nhập -> load từ localStorage
      const savedCart = localStorage.getItem("cartItems");
      try {
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      } catch {
        setCartItems([]);
      }
      return;
    }

    // Đã đăng nhập -> load từ database
    try {
      setLoading(true);
      const response = await cartApi.get();
      const cartData = response.data;

      if (cartData && cartData.cart_details) {
        const items = cartData.cart_details.map(detail => ({
          id: detail.product_id,
          name: detail.product?.name || "Sản phẩm",
          price: detail.price,
          quantity: detail.quantity,
          image: detail.product?.image || "",
          maxStock: detail.product?.quantity || 99,
          cartDetailId: detail.id
        }));
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Lỗi load giỏ hàng:", error);
      // Fallback về localStorage nếu API lỗi
      const savedCart = localStorage.getItem("cartItems");
      try {
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      } catch {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Lưu localStorage cho guest
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = async (product) => {
    const token = localStorage.getItem("token");
    const maxStock = product.quantity;

    if (token) {
      // Đã đăng nhập -> gọi API
      try {
        await cartApi.add(product.id, 1);
        await loadCart(); // Reload giỏ hàng từ server
      } catch (error) {
        console.error("Lỗi thêm giỏ hàng:", error);
        alert("Không thể thêm vào giỏ hàng!");
      }
    } else {
      // Chưa đăng nhập -> lưu localStorage
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === product.id);

        if (existingItem) {
          if (existingItem.quantity + 1 > existingItem.maxStock) {
            alert(`Số lượng sản phẩm trong kho chỉ còn ${existingItem.maxStock} cái!`);
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
    }
  };

  const removeFromCart = async (id) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const item = cartItems.find(i => i.id === id);
        if (item && item.cartDetailId) {
          await cartApi.remove(item.cartDetailId);
          await loadCart();
        }
      } catch (error) {
        console.error("Lỗi xóa khỏi giỏ hàng:", error);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
    prev
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;

          if (newQty > item.maxStock) {
            alert(`Kho chỉ còn ${item.maxStock} sản phẩm.`);
            return item;
          }

          return { ...item, quantity: newQty };
        }
        return item;
      })
      // Xoá các sản phẩm có số lượng <= 0
      .filter((item) => item.quantity > 0)
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

  const clearCart = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await cartApi.clear();
      } catch (error) {
        console.error("Lỗi xóa giỏ hàng:", error);
      }
    }
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const cartCount = cartItems.length;

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
        loadCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
