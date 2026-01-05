import React, { useEffect, useState } from "react";
import {
  FaUserFriends,
  FaDollarSign,
  FaBoxOpen,
  FaClipboardList,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { statsApi } from "../../../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0,
    chart_orders: [],
    chart_revenue: [],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await statsApi.getDashboard();
      setStats(res.data);
    } catch (error) {
      console.error("Lỗi lấy thống kê:", error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // --- DỮ LIỆU GIẢ LẬP CHO BIỂU ĐỒ (HARDCODED DATA) ---
  // Để làm biểu đồ thật cần query phức tạp hơn ở Backend,
  // tạm thời dùng dữ liệu giả để lên giao diện giống hình trước.
  const dataLineChart = [
    { name: "06-12", orders: 0 },
    { name: "07-12", orders: 0 },
    { name: "08-12", orders: 0 },
    { name: "10-12", orders: 0 },
    { name: "11-12", orders: 5 }, // Ví dụ ngày này cao vọt lên
    { name: "12-12", orders: 1 },
    { name: "14-12", orders: 0 },
    { name: "15-12", orders: 0 },
    { name: "17-12", orders: 0 },
    { name: "18-12", orders: 1 },
  ];

  const dataBarChart = [
    { name: "T1", revenue: 0 },
    { name: "T2", revenue: 0 },
    { name: "T11", revenue: 0 },
    { name: "T12", revenue: 200000000 },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Thống kê</h2>

      {/* --- 4 CARDS --- */}
      <div className="stats-grid">
        {/* Card 1: Users */}
        <div className="stat-card blue">
          <div className="stat-icon" style={{ background: "#4e73df" }}>
            <FaUserFriends />
          </div>
          <div className="stat-info">
            <h4>Tổng người dùng</h4>
            <p>{stats.total_users}</p>
          </div>
        </div>

        {/* Card 2: Revenue */}
        <div className="stat-card green">
          <div className="stat-icon" style={{ background: "#1cc88a" }}>
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <h4>Tổng doanh thu</h4>
            <p style={{ color: "#1cc88a" }}>
              {formatCurrency(stats.total_revenue)}
            </p>
          </div>
        </div>

        {/* Card 3: Products */}
        <div className="stat-card orange">
          <div className="stat-icon" style={{ background: "#f6c23e" }}>
            <FaBoxOpen />
          </div>
          <div className="stat-info">
            <h4>Tổng sản phẩm</h4>
            <p>{stats.total_products}</p>
          </div>
        </div>

        {/* Card 4: Orders */}
        <div className="stat-card red">
          <div className="stat-icon" style={{ background: "#e74a3b" }}>
            <FaClipboardList />
          </div>
          <div className="stat-info">
            <h4>Tổng đơn hàng</h4>
            <p>{stats.total_orders}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Biểu đồ Đơn hàng (Area Chart) */}
        <div className="chart-card">
          <div className="chart-header">📈 Đơn hàng (14 ngày gần đây)</div>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={stats.chart_orders}>
                {/* Tạo Gradient màu xanh nhạt dần xuống dưới */}
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4e73df" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4e73df" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  style={{ fontSize: "12px" }}
                  interval={1}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />

                {/* Dùng Area thay vì Line */}
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#4e73df" // Màu đường kẻ (Xanh đậm)
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorOrders)" // Link tới gradient ở trên
                  dot={{
                    r: 4,
                    fill: "#4e73df",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }} // Điểm tròn trắng viền xanh
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ Doanh thu (Bar) */}
        <div className="chart-card">
          <div className="chart-header">📊 Doanh thu theo tháng</div>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              {/* SỬA data={stats.chart_revenue} */}
              <BarChart data={stats.chart_revenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" interval={0} />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("en", { notation: "compact" }).format(
                      value
                    )
                  }
                />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar
                  dataKey="revenue"
                  fill="#4e73df"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
