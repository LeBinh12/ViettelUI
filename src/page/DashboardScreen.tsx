import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const DashboardScreen: React.FC = () => {
  const stats = [
    { label: "Sản phẩm", value: 120, color: "bg-blue-500", textColor: "text-white" },
    { label: "Người dùng", value: 540, color: "bg-green-500", textColor: "text-white" },
    { label: "Đơn hàng", value: 87, color: "bg-yellow-400", textColor: "text-gray-800" },
    { label: "Doanh thu", value: "₫120,000,000", color: "bg-red-500", textColor: "text-white" },
  ];

  const chartData = [
    { month: "Th1", revenue: 8000000 },
    { month: "Th2", revenue: 10000000 },
    { month: "Th3", revenue: 9000000 },
    { month: "Th4", revenue: 12000000 },
    { month: "Th5", revenue: 11000000 },
    { month: "Th6", revenue: 14000000 },
  ];

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h2>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className={`shadow rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-md transition ${item.color}`}
          >
            <p className={`text-sm ${item.textColor}`}>{item.label}</p>
            <p className={`text-2xl font-semibold mt-2 ${item.textColor}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Doanh thu theo tháng
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(value)
              }
            />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(value)
              }
            />
            <Bar dataKey="revenue" fill="#1D4ED8" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardScreen;
