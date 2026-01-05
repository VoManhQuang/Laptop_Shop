import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email, password) =>
    api.post(
      "/auth/login",
      new URLSearchParams({ username: email, password }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    ),
  register: (userData) => api.post("/auth/register", userData),
  socialLogin: (data) => api.post("/auth/social-login", data),
};

export const userApi = {
  getAll: () => api.get("/users"),
  delete: (id) => api.delete(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => {
    return api.post("/users/", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  changePassword: (data) => api.put("/users/change-password", data),
};

export const productsApi = {
  getAll: (params) => api.get("/products/", { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products/", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/products/upload-image", formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
  },
};

export const cartApi = {
  get: () => api.get("/cart"),
  add: (productId) => api.post(`/cart/add/${productId}`),
  increase: (productId) => api.post(`/cart/increase/${productId}`),
  decrease: (productId) => api.post(`/cart/decrease/${productId}`),
  remove: (cartDetailId) => api.delete(`/cart/remove/${cartDetailId}`),
  clear: () => api.delete("/cart/clear"),
};

export const orderApi = {
  createOrder: (orderData) => api.post("/orders", orderData),
  getAll: () => api.get("/orders"),
  updateStatus: (id, status) => api.put(`/orders/${id}`, { status }),
  getById: (id) => api.get(`/orders/${id}`),
  update: (id, data) => api.put(`/orders/${id}`, data),
  delete: (id) => api.delete(`/orders/${id}`),
  getMyOrders: () => api.get("/orders/my-orders"),
};

export const statsApi = {
  getDashboard: () => api.get("/stats/dashboard"),
};

export default api;
