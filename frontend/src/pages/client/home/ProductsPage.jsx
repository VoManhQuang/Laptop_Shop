import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import ProductCard from "../products/ProductCard";

import { productsApi } from "../../../services/api";
import "./ProductsPage.css";
import "../home/ProductsPage.css";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await productsApi.getAll();
      setProducts(response.data);
      // Extract unique categories from factory
      const uniqueCategories = [
        ...new Set(response.data.map((p) => p.factory).filter(Boolean)),
      ];
      setCategories(["All", ...uniqueCategories]);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (selectedCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.factory === selectedCategory)
      );
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading">Đang tải...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="products-page">
        <div className="sidebar">
          <h3>Danh mục sản phẩm</h3>
          <ul>
            {categories.map((category) => (
              <li
                key={category}
                className={selectedCategory === category ? "active" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
        <div className="product-grid">
          <h2>Sản phẩm</h2>
          <div className="products-container">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} showCart={true} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
