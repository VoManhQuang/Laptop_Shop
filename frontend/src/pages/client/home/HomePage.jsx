import React, { useEffect, useState } from "react";
import { productsApi } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaStar,
  FaShoppingCart,
  FaLaptop,
  FaCheckCircle,
  FaTruck,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
} from "react-icons/fa";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import ProductCard from "../../client/products/ProductCard";
import "./HomePage.css";
import "../products/ProductCard.css";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productsApi.getAll();
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (value, setSelected, selectedList) => {
    if (selectedList.includes(value)) {
      setSelected(selectedList.filter((item) => item !== value));
    } else {
      setSelected([...selectedList, value]);
    }
  };

  const handleFilter = () => {
    let result = products;

    if (searchTerm.trim() !== "") {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.some((brand) =>
          product.name.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    if (selectedPrices.length > 0) {
      result = result.filter((product) => {
        const price = product.price;
        return selectedPrices.some((range) => {
          if (range === "under10") return price < 10000000;
          if (range === "10-20") return price >= 10000000 && price <= 20000000;
          if (range === "20-30") return price >= 20000000 && price <= 30000000;
          if (range === "above30") return price > 30000000;
          return false;
        });
      });
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleFilter();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);

    let sortedList = [...filteredProducts];

    switch (order) {
      case "price_asc":
        sortedList.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sortedList.sort((a, b) => b.price - a.price);
        break;
      default:
        sortedList.sort((a, b) => b.id - a.id);
        break;
    }
    setFilteredProducts(sortedList);
    setCurrentPage(1);
  };

  return (
    <div className="client-container">
      <Header />

      <div className="hero-banner">
        {/* ... (Giữ nguyên banner) ... */}
        <h1 className="hero-title">Khám phá Laptop chất lượng cao</h1>
        <p className="hero-subtitle">
          Tìm kiếm laptop phù hợp với nhu cầu của bạn
        </p>
        <div className="hero-stats">
          <div className="stat-item">
            <FaLaptop /> 50+ Sản phẩm
          </div>
          <div className="stat-item">
            <FaCheckCircle /> 100% Chính hãng
          </div>
          <div className="stat-item">
            <FaTruck /> Miễn phí vận chuyển
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="sidebar-filter">
          <div className="filter-group">
            <div className="filter-title">
              <FaSearch /> TÌM KIẾM
            </div>
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Nhập tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <FaSearch
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "10px",
                  color: "#aaa",
                  cursor: "pointer",
                }}
                onClick={handleFilter}
              />
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-title">💰 MỨC GIÁ</div>
            <label className="checkbox-item">
              <input
                type="checkbox"
                onChange={() =>
                  handleCheckboxChange(
                    "under10",
                    setSelectedPrices,
                    selectedPrices
                  )
                }
              />{" "}
              Dưới 10 triệu
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                onChange={() =>
                  handleCheckboxChange(
                    "10-20",
                    setSelectedPrices,
                    selectedPrices
                  )
                }
              />{" "}
              10 - 20 triệu
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                onChange={() =>
                  handleCheckboxChange(
                    "20-30",
                    setSelectedPrices,
                    selectedPrices
                  )
                }
              />{" "}
              20 - 30 triệu
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                onChange={() =>
                  handleCheckboxChange(
                    "above30",
                    setSelectedPrices,
                    selectedPrices
                  )
                }
              />{" "}
              Trên 30 triệu
            </label>
          </div>

          <div className="filter-group">
            <div className="filter-title">🏷️ Hãng</div>
            {["Dell", "Asus", "Macbook", "Lenovo", "Acer"].map((brand) => (
              <label className="checkbox-item" key={brand}>
                <input
                  type="checkbox"
                  onChange={() =>
                    handleCheckboxChange(
                      brand,
                      setSelectedBrands,
                      selectedBrands
                    )
                  }
                />{" "}
                {brand}
              </label>
            ))}
          </div>

          <button className="btn-filter" onClick={handleFilter}>
            <FaFilter /> Lọc sản phẩm
          </button>
        </div>

        <div className="product-grid-section">
          <div className="sort-bar">
            <select
              value={sortOrder}
              onChange={handleSortChange}
              style={{
                padding: "5px 10px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
            </select>
          </div>

          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : (
            <>
              <div className="products-grid">
                {currentProducts.map((item) => (
                  <ProductCard key={item.id} product={item} showCart={true} />
                ))}
              </div>

              {filteredProducts.length > itemsPerPage && (
                <div className="pagination">
                  {/* Nút Prev */}
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={currentPage === i + 1 ? "active" : ""}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
