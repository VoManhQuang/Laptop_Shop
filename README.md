# 💻 Laptop Shop

> Website bán laptop với đầy đủ tính năng quản lý và mua sắm trực tuyến

## 👥 Nhóm J97

| Họ và Tên | 
|-----------|
| Võ Mạnh Quang |
| Phan Minh Nhật |
| Trần Đình Việt |
| Nguyễn Mạnh Tuấn |
| Nguyễn Duy Việt |
| Lê Thị Trà Giang |

---

## 📋 Mô tả dự án

Laptop Shop là một ứng dụng web bán laptop hoàn chỉnh với:
- **Frontend**: React.js + Vite
- **Backend**: FastAPI (Python)
- **Database**: MySQL
- **Authentication**: JWT + OAuth2 (Google/Facebook)

---

## 🚀 Tính năng

### 👤 Khách hàng
- Đăng ký / Đăng nhập (Email, Google, Facebook)
- Xem danh sách sản phẩm laptop
- Xem chi tiết sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Quản lý wishlist (yêu thích)
- Đặt hàng và thanh toán
- Xem lịch sử đơn hàng
- Quản lý thông tin cá nhân

### 🔐 Quản trị viên (Admin)
- Dashboard thống kê
- Quản lý người dùng (CRUD)
- Quản lý sản phẩm (CRUD)
- Quản lý đơn hàng (Xem, cập nhật trạng thái)

---

## 🛠️ Công nghệ sử dụng

### Frontend
| Công nghệ | Phiên bản |
|-----------|-----------|
| React | 18.2.0 |
| Vite | 5.0.8 |
| React Router DOM | 6.21.0 |
| Bootstrap | 5.3.2 |
| React Bootstrap | 2.9.1 |
| Axios | 1.6.2 |
| Firebase | 12.7.0 |
| React Icons | 4.12.0 |
| React Toastify | 9.1.3 |
| Recharts | 3.6.0 |

### Backend
| Công nghệ | Phiên bản |
|-----------|-----------|
| FastAPI | 0.115.0 |
| Uvicorn | 0.32.0 |
| SQLAlchemy | 2.0.36 |
| PyMySQL | 1.1.0 |
| Pydantic | 2.9.2 |
| Python-Jose | 3.3.0 |
| Passlib | 1.7.4 |
| Alembic | latest |

---

## 📁 Cấu trúc dự án

```
Laptop_Shop/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── routers/         # API endpoints
│   │   ├── schemas/         # Pydantic schemas
│   │   └── utils/           # Utilities (hashing, etc.)
│   ├── alembic/             # Database migrations
│   ├── uploads/             # Uploaded files
│   ├── config.py            # Configuration
│   ├── database.py          # Database connection
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React Context (Auth, Cart, Wishlist)
│   │   ├── firebase/        # Firebase configuration
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── auth/        # Authentication pages
│   │   │   └── client/      # Client pages
│   │   └── services/        # API services
│   └── package.json
│
└── Image/                   # Static images
```

---

## ⚙️ Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Python 3.10+
- Node.js 18+
- MySQL 8.0+

### 1️⃣ Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt
```

### 2️⃣ Cấu hình Database

Tạo file `.env` trong thư mục `backend/`:

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/laptop_shop
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Chạy migration:

```bash
# Tạo database tables
python apply_migration.py
```

### 3️⃣ Chạy Backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend sẽ chạy tại: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 4️⃣ Cài đặt Frontend

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install
```

### 5️⃣ Cấu hình Firebase (Optional - cho đăng nhập Google/Facebook)

Cập nhật file `frontend/src/firebase/firebase.config.js` với thông tin Firebase project của bạn.

### 6️⃣ Chạy Frontend

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/social-login` | Đăng nhập Google/Facebook |

### Products
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/products/` | Lấy danh sách sản phẩm |
| GET | `/api/products/{id}` | Lấy chi tiết sản phẩm |
| POST | `/api/products/` | Tạo sản phẩm mới |
| PUT | `/api/products/{id}` | Cập nhật sản phẩm |
| DELETE | `/api/products/{id}` | Xóa sản phẩm |

### Cart
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/cart` | Lấy giỏ hàng |
| POST | `/api/cart/add/{productId}` | Thêm vào giỏ hàng |
| POST | `/api/cart/increase/{productId}` | Tăng số lượng |
| POST | `/api/cart/decrease/{productId}` | Giảm số lượng |
| DELETE | `/api/cart/remove/{cartDetailId}` | Xóa khỏi giỏ hàng |
| DELETE | `/api/cart/clear` | Xóa toàn bộ giỏ hàng |

### Orders
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/orders` | Lấy tất cả đơn hàng |
| GET | `/api/orders/my-orders` | Lấy đơn hàng của user |
| GET | `/api/orders/{id}` | Lấy chi tiết đơn hàng |
| POST | `/api/orders` | Tạo đơn hàng |
| PUT | `/api/orders/{id}` | Cập nhật đơn hàng |
| DELETE | `/api/orders/{id}` | Xóa đơn hàng |

### Users
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/users` | Lấy danh sách users |
| GET | `/api/users/{id}` | Lấy thông tin user |
| GET | `/api/users/profile` | Lấy profile |
| PUT | `/api/users/{id}` | Cập nhật user |
| PUT | `/api/users/profile` | Cập nhật profile |
| PUT | `/api/users/change-password` | Đổi mật khẩu |
| DELETE | `/api/users/{id}` | Xóa user |

### Statistics
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/stats/dashboard` | Lấy thống kê dashboard |

---

## 🖼️ Screenshots

*(Thêm screenshots của ứng dụng tại đây)*

---

## 📄 License

MIT License

---

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

---

⭐ **Nếu project này hữu ích, hãy cho chúng tôi một star!**
