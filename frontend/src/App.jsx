import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import { AuthProvider } from "./context/AuthContext";
import ManageUser from "./pages/admin/User/ManageUser";
import CreateUser from "./pages/admin/User/CreateUser";
import ViewUser from "./pages/admin/User/ViewUser";
import UpdateUser from "./pages/admin/User/UpdateUser";
import ManageProduct from "./pages/admin/Product/ManageProduct";
import CreateProduct from "./pages/admin/Product/CreateProduct";
import ViewProduct from "./pages/admin/Product/ViewProduct";
import UpdateProduct from "./pages/admin/Product/UpdateProduct";
import ManageOrder from "./pages/admin/Order/ManageOrder";
import ViewOrder from "./pages/admin/Order/ViewOrder";
import UpdateOrder from "./pages/admin/Order/UpdateOrder";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/client/home/HomePage";
import ProductDetail from "./pages/client/product/ProductDetail";
import CartPage from "./pages/client/cart/CartPage";
import { CartProvider } from "./context/CartContext";
import CheckoutPage from "./pages/client/checkout/CheckoutPage";
import ProfilePage from "./pages/client/profile/ProfilePage";
import OrderHistory from "./pages/client/OrderHistory/OrderHistory";
import WishlistPage from "./pages/client/Wishlist/WishlistPage";
import AdminRoute from "./components/auth/AdminRoute";
import Dashboard from "./pages/admin/Dashboard/Dashboard";

function App() {
  return (
    <AuthProvider>
      {" "}
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <h1>
                  <a href="/login">Login Admin</a>
                </h1>
              }
            />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/history" element={<OrderHistory />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />

                <Route path="users" element={<ManageUser />} />
                <Route path="users/create" element={<CreateUser />} />
                <Route path="users/:id" element={<ViewUser />} />
                <Route path="users/update/:id" element={<UpdateUser />} />

                <Route path="products" element={<ManageProduct />} />
                <Route path="products/create" element={<CreateProduct />} />
                <Route path="products/:id" element={<ViewProduct />} />
                <Route path="products/update/:id" element={<UpdateProduct />} />

                <Route path="orders" element={<ManageOrder />} />
                <Route path="orders/:id" element={<ViewOrder />} />
                <Route path="orders/update/:id" element={<UpdateOrder />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
