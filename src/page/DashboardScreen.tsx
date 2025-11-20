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
    {
      label: "Sản phẩm",
      value: 120,
      // icon: <Package size={26} className="text-indigo-600" />,
      color: "bg-indigo-50",
      textColor: "text-indigo-700",
    },
    {
      label: "Người dùng",
      value: 540,
      // icon: <Users size={26} className="text-emerald-600" />,
      color: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
    {
      label: "Đơn hàng",
      value: 87,
      // icon: <ShoppingBag size={26} className="text-amber-600" />,
      color: "bg-amber-50",
      textColor: "text-amber-700",
    },
    {
      label: "Doanh thu",
      value: "₫120,000,000",
      // icon: <DollarSign size={26} className="text-rose-600" />,
      color: "bg-rose-50",
      textColor: "text-rose-700",
    },
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

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center ${item.color}`}
          >
            {/* Icon */}
            <div className="mb-3">
              {item.icon}
            </div>

            {/* Label */}
            <p className={`text-sm font-medium ${item.textColor}`}>
              {item.label}
            </p>

            {/* Value */}
            <p className={`text-3xl font-semibold mt-2 ${item.textColor}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Doanh thu theo tháng
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis
              stroke="#6B7280"
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
              contentStyle={{ borderRadius: 10, borderColor: "#E5E7EB" }}
            />
            <Bar
              dataKey="revenue"
              fill="#6366F1"
              radius={[8, 8, 0, 0]}
              barSize={42}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardScreen;
