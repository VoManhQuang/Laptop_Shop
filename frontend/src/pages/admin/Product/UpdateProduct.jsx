import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productsApi } from "../../../services/api";
import "../User/CreateUser.css";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    factory: "",
    target: "",
    short_desc: "",
    detail_desc: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productsApi.getById(id);
        const data = res.data;

        setFormData({
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          factory: data.factory || "",
          target: data.target || "",
          short_desc: data.short_desc || "",
          detail_desc: data.detail_desc,
          image: data.image || "",
        });

        if (data.image) {
          setPreview(`http://localhost:8000/uploads/${data.image}`);
        }
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        alert("Không tìm thấy sản phẩm!");
        navigate("/admin/products");
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên sản phẩm.";
      isValid = false;
    }

    // 2. Hãng (Factory)
    if (!formData.factory) {
      newErrors.factory = "Vui lòng chọn hãng sản xuất.";
      isValid = false;
    }

    // 3. Giá (Price)
    if (!formData.price) {
      newErrors.price = "Vui lòng nhập giá.";
      isValid = false;
    } else {
      const numberRegex = /^[0-9]+(\.[0-9]+)?$/;
      if (!numberRegex.test(String(formData.price))) {
        newErrors.price = "Giá phải là số, không chứa ký tự đặc biệt.";
        isValid = false;
      } else if (parseFloat(formData.price) <= 0) {
        newErrors.price = "Giá sản phẩm phải lớn hơn 0.";
        isValid = false;
      }
    }

    if (formData.quantity === "" || formData.quantity === null) {
      newErrors.quantity = "Vui lòng nhập số lượng.";
      isValid = false;
    } else {
      const numberRegex = /^[0-9]+$/;
      if (!numberRegex.test(String(formData.quantity))) {
        newErrors.quantity = "Số lượng phải là số nguyên.";
        isValid = false;
      } else if (parseInt(formData.quantity) <= 0) {
        newErrors.quantity = "Số lượng kho phải lớn hơn 0.";
        isValid = false;
      }
    }

    if (!formData.target) {
      newErrors.target = "Vui lòng chọn đối tượng.";
      isValid = false;
    }

    if (!formData.short_desc.trim()) {
      newErrors.short_desc = "Vui lòng nhập mô tả ngắn.";
      isValid = false;
    }
    if (!formData.detail_desc.trim()) {
      newErrors.detail_desc = "Vui lòng nhập mô tả chi tiết.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let imageToSave = formData.image;

      if (selectedFile) {
        const uploadRes = await productsApi.uploadImage(selectedFile);
        imageToSave = uploadRes.data.image_name;
      }

      const updateData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        image: imageToSave,
      };

      await productsApi.update(id, updateData);

      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert(
        "Lỗi cập nhật: " + (error.response?.data?.detail || "Có lỗi xảy ra")
      );
    }
  };

  return (
    <div className="create-user-container">
      <div className="header-actions">
        <div>
          <h2>Cập nhật sản phẩm</h2>
          <span className="breadcrumb">Dashboard / Products / Update</span>
        </div>
        <button
          className="btn-back"
          onClick={() => navigate("/admin/products")}
        >
          Quay lại
        </button>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        {/* Hàng 1: ID và Tên */}
        <div className="form-row">
          <div className="form-group">
            <label>ID</label>
            <input
              type="text"
              value={id}
              disabled
              style={{ background: "#f1f1f1" }}
            />
          </div>
          <div className="form-group">
            <label>
              Tên sản phẩm <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>
        </div>

        {/* Hàng 2: Hãng và Giá */}
        <div className="form-row">
          <div className="form-group">
            <label>
              Hãng sản xuất <span style={{ color: "red" }}>*</span>
            </label>
            {/* Đổi Input thành Select */}
            <select
              name="factory"
              value={formData.factory}
              onChange={handleChange}
              className={errors.factory ? "input-error" : ""}
            >
              <option value="">-- Chọn hãng --</option>
              <option value="Dell">Dell</option>
              <option value="Asus">Asus</option>
              <option value="Macbook">Macbook</option>
              <option value="Lenovo">Lenovo</option>
              <option value="Acer">Acer</option>
            </select>
            {errors.factory && (
              <span className="error-message">{errors.factory}</span>
            )}
          </div>
          <div className="form-group">
            <label>
              Giá (VNĐ) <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="number"
              name="price"
              min="1"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? "input-error" : ""}
            />
            {errors.price && (
              <span className="error-message">{errors.price}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Số lượng kho <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="number"
              name="quantity"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              className={errors.quantity ? "input-error" : ""}
            />
            {errors.quantity && (
              <span className="error-message">{errors.quantity}</span>
            )}
          </div>
          <div className="form-group">
            <label>
              Đối tượng <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="target"
              value={formData.target}
              onChange={handleChange}
              className={errors.target ? "input-error" : ""}
            >
              <option value="">-- Chọn đối tượng --</option>
              <option value="Gaming">Gaming</option>
              <option value="Văn phòng">Văn phòng</option>
              <option value="Đồ họa kỹ thuật">Đồ họa kỹ thuật</option>
            </select>
            {errors.target && (
              <span className="error-message">{errors.target}</span>
            )}
          </div>
        </div>

        {/* Hàng 4: Mô tả */}
        <div className="form-group">
          <label>
            Mô tả ngắn <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="short_desc"
            value={formData.short_desc}
            onChange={handleChange}
            className={errors.short_desc ? "input-error" : ""}
          />
          {errors.short_desc && (
            <span className="error-message">{errors.short_desc}</span>
          )}
        </div>

        <div className="form-group">
          <label>
            Mô tả chi tiết <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            name="detail_desc"
            rows="5"
            value={formData.detail_desc}
            onChange={handleChange}
            style={{
              padding: "10px",
              border: errors.detail_desc ? "1px solid red" : "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          {errors.detail_desc && (
            <span className="error-message">{errors.detail_desc}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Thay đổi hình ảnh</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
          </div>
          <div className="preview-section" style={{ marginTop: 0 }}>
            <label>Ảnh sản phẩm</label>
            <div className="img-preview-box">
              {preview ? (
                <img src={preview} alt="Preview" />
              ) : (
                <span>No Image</span>
              )}
            </div>
          </div>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn-submit">
            Lưu thay đổi
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/products")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
