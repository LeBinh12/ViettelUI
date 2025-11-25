import { Activity, AlertCircle, BarChart3, Calendar, Clock, DollarSign, Download, FileText, Package, RefreshCw, TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DashboardScreen: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  const [timeRange, setTimeRange] = useState("6months");
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setAnimate(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const stats = [
    {
      label: "Tổng số hóa đơn trong ngày",
      value: 45,
      icon: FileText,
      color: "bg-gradient-to-br from-blue-600 to-blue-700",
      shadowColor: "shadow-blue-200",
      trend: "+12%",
      trendUp: true
    },
    {
      label: "Tổng số người dùng",
      value: 540,
      icon: Users,
      color: "bg-gradient-to-br from-indigo-600 to-indigo-700",
      shadowColor: "shadow-indigo-200",
      trend: "+8%",
      trendUp: true
    },
    {
      label: "Tổng số gói hiện tại",
      value: 320,
      icon: Package,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-200",
      trend: "+5%",
      trendUp: true
    },
    {
      label: "Tổng số gói đang lỗi",
      value: 12,
      icon: AlertCircle,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      shadowColor: "shadow-red-200",
      trend: "-3%",
      trendUp: false
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

  const packageData = [
    { name: "Gói Cơ bản", value: 120 },
    { name: "Gói Nâng cao", value: 95 },
    { name: "Gói Premium", value: 85 },
    { name: "Gói Enterprise", value: 20 },
  ];

  const activityData = [
    { time: "00:00", activity: 120 },
    { time: "04:00", activity: 80 },
    { time: "08:00", activity: 250 },
    { time: "12:00", activity: 380 },
    { time: "16:00", activity: 420 },
    { time: "20:00", activity: 290 },
  ];

  const revenueComparisonData = [
    { month: "Th1", thisYear: 8000000, lastYear: 6500000 },
    { month: "Th2", thisYear: 10000000, lastYear: 8000000 },
    { month: "Th3", thisYear: 9000000, lastYear: 7500000 },
    { month: "Th4", thisYear: 12000000, lastYear: 9000000 },
    { month: "Th5", thisYear: 11000000, lastYear: 8500000 },
    { month: "Th6", thisYear: 14000000, lastYear: 10000000 },
  ];

  const topCustomers = [
    { name: "Công ty TNHH ABC", invoices: 45, revenue: 125000000 },
    { name: "Công ty CP XYZ", invoices: 38, revenue: 98000000 },
    { name: "Doanh nghiệp DEF", invoices: 32, revenue: 87000000 },
    { name: "Công ty GHI", invoices: 28, revenue: 76000000 },
    { name: "Tập đoàn JKL", invoices: 25, revenue: 65000000 },
  ];

  const recentActivities = [
    { action: "Tạo hóa đơn mới", customer: "Công ty ABC", time: "2 phút trước", status: "success" },
    { action: "Cập nhật gói dịch vụ", customer: "Công ty XYZ", time: "15 phút trước", status: "info" },
    { action: "Báo lỗi gói", customer: "Doanh nghiệp DEF", time: "1 giờ trước", status: "error" },
    { action: "Thanh toán hoàn tất", customer: "Công ty GHI", time: "2 giờ trước", status: "success" },
  ];

  const COLORS = ["#1E40AF", "#2563EB", "#3B82F6", "#60A5FA"];

  const handleExportExcel = () => {
    alert("Xuất Excel - Tính năng sẽ được triển khai");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header với nút xuất Excel */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 bg-clip-text text-transparent mb-2">
                Quản lý Hóa đơn Điện tử
              </h1>
              <p className="text-slate-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Tổng quan và thống kê hệ thống
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-xl shadow-md border border-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-slate-700">
                  {currentTime.toLocaleTimeString('vi-VN')}
                </span>
              </div>
              <button
                onClick={handleRefresh}
                className={`p-3 bg-white rounded-xl hover:bg-slate-50 transition-all duration-300 shadow-md border border-slate-200 hover:shadow-lg ${refreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={handleExportExcel}
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:scale-105 font-medium"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                Xuất Excel
              </button>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["Hôm nay", "7 ngày", "30 ngày", "6 tháng", "1 năm"].map((period, idx) => (
              <button
                key={idx}
                onClick={() => setTimeRange(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${timeRange === period
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
              >
                <Calendar className="w-4 h-4 inline mr-1" />
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`${animate ? 'animate-slide-up' : 'opacity-0'} bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105 ${item.shadowColor} shadow-lg group`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${item.color} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${item.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.trend}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-2 font-medium">{item.label}</p>
                <p className="text-3xl font-bold text-slate-900">{item.value.toLocaleString('vi-VN')}</p>
              </div>
            );
          })}
        </div>

        {/* Biểu đồ tròn và biểu đồ cột */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Biểu đồ tròn */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Tổng các gói theo loại</h3>
              <p className="text-slate-600 text-sm">Phân bổ gói dịch vụ</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={packageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={3}
                  stroke="#fff"
                  animationBegin={200}
                  animationDuration={800}
                >
                  {packageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Biểu đồ cột doanh thu */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Doanh thu theo tháng</h3>
              <p className="text-slate-600 text-sm">6 tháng gần nhất</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                />
                <YAxis
                  stroke="#64748B"
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      notation: "compact",
                      compactDisplay: "short"
                    }).format(value)
                  }
                  style={{ fontSize: '14px' }}
                />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(value)
                  }
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ fontWeight: 600, color: '#1E40AF' }}
                />
                <Bar
                  dataKey="revenue"
                  radius={[12, 12, 0, 0]}
                  animationBegin={200}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#colorGradient${index})`} />
                  ))}
                </Bar>
                <defs>
                  {chartData.map((entry, index) => (
                    <linearGradient key={index} id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E40AF" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ hoạt động mới */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 mb-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Hoạt động trong ngày
            </h3>
            <p className="text-slate-600 text-sm">Số lượng giao dịch theo giờ</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="time"
                stroke="#64748B"
                style={{ fontSize: '14px', fontWeight: 500 }}
              />
              <YAxis
                stroke="#64748B"
                style={{ fontSize: '14px' }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 600, color: '#1E40AF' }}
              />
              <Area
                type="monotone"
                dataKey="activity"
                stroke="#1E40AF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorActivity)"
                animationBegin={200}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* So sánh doanh thu và Top khách hàng */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* So sánh doanh thu năm nay vs năm trước */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                So sánh doanh thu
              </h3>
              <p className="text-slate-600 text-sm">Năm nay vs Năm trước</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                />
                <YAxis
                  stroke="#64748B"
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      notation: "compact",
                      compactDisplay: "short"
                    }).format(value)
                  }
                  style={{ fontSize: '14px' }}
                />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(value)
                  }
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar
                  dataKey="lastYear"
                  fill="#94A3B8"
                  radius={[8, 8, 0, 0]}
                  name="Năm trước"
                  animationBegin={200}
                  animationDuration={800}
                />
                <Bar
                  dataKey="thisYear"
                  fill="#1E40AF"
                  radius={[8, 8, 0, 0]}
                  name="Năm nay"
                  animationBegin={400}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top khách hàng */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Top khách hàng
              </h3>
              <p className="text-slate-600 text-sm">5 khách hàng có doanh thu cao nhất</p>
            </div>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl hover:shadow-md transition-all duration-300 border border-slate-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{customer.name}</p>
                      <p className="text-sm text-slate-600">{customer.invoices} hóa đơn</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-700 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {(customer.revenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hoạt động gần đây */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Hoạt động gần đây
            </h3>
            <p className="text-slate-600 text-sm">Các giao dịch và thay đổi mới nhất</p>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all duration-300 border border-slate-100 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    } shadow-lg group-hover:scale-150 transition-transform`} />
                  <div>
                    <p className="font-semibold text-slate-900">{activity.action}</p>
                    <p className="text-sm text-slate-600">{activity.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DashboardScreen;






// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// const DashboardScreen: React.FC = () => {
//   const stats = [
//     { label: "Sản phẩm", value: 120, color: "bg-blue-500", textColor: "text-white" },
//     { label: "Người dùng", value: 540, color: "bg-green-500", textColor: "text-white" },
//     { label: "Đơn hàng", value: 87, color: "bg-yellow-400", textColor: "text-gray-800" },
//     { label: "Doanh thu", value: "₫120,000,000", color: "bg-red-500", textColor: "text-white" },
//   ];

//   const chartData = [
//     { month: "Th1", revenue: 8000000 },
//     { month: "Th2", revenue: 10000000 },
//     { month: "Th3", revenue: 9000000 },
//     { month: "Th4", revenue: 12000000 },
//     { month: "Th5", revenue: 11000000 },
//     { month: "Th6", revenue: 14000000 },
//   ];

//   return (
//     <div className="space-y-8 p-4">
//       <h2 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h2>

//       {/* Thống kê tổng quan */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((item) => (
//           <div
//             key={item.label}
//             className={`shadow rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-md transition ${item.color}`}
//           >
//             <p className={`text-sm ${item.textColor}`}>{item.label}</p>
//             <p className={`text-2xl font-semibold mt-2 ${item.textColor}`}>
//               {item.value}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Biểu đồ doanh thu */}
//       <div className="bg-white shadow rounded-2xl p-6">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">
//           Doanh thu theo tháng
//         </h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart
//             data={chartData}
//             margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis
//               tickFormatter={(value) =>
//                 new Intl.NumberFormat("vi-VN", {
//                   style: "currency",
//                   currency: "VND",
//                 }).format(value)
//               }
//             />
//             <Tooltip
//               formatter={(value: number) =>
//                 new Intl.NumberFormat("vi-VN", {
//                   style: "currency",
//                   currency: "VND",
//                 }).format(value)
//               }
//             />
//             <Bar dataKey="revenue" fill="#1D4ED8" radius={[6, 6, 0, 0]} barSize={40} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default DashboardScreen;
