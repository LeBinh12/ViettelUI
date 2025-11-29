import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Clock,
  Download,
  FileText,
  Package,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { statisticalApi } from "../api/statisticalApi";
import type {
  TotalPackageByCategory,
  ListTopCustomersResponse,
} from "../types/statistical";
import { exportExcelApi } from "../api/exportExcelApi";

interface MonthlyRevenueData {
  month: string;
  revenue: number;
}

const DashboardScreen: React.FC = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [chartData, setChartData] = useState<MonthlyRevenueData[]>([]);
  const [packageData, setPackageData] = useState<
    { name: string; value: number }[]
  >([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const COLORS = ["#1E40AF", "#2563EB", "#3B82F6", "#60A5FA"];
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Lấy tổng khách hàng
      const totalCustomer = await statisticalApi.totalCustomer();
      // Lấy tổng gói dịch vụ
      const totalPackage = await statisticalApi.totalPackage();
      // Lấy tổng gói theo category
      const packageByCategory: TotalPackageByCategory =
        await statisticalApi.totalPackageByCategory();
      // Lấy số hóa đơn bị tampered
      const tamperedInvoices = await statisticalApi.tamperedInvoicesCount();
      // Lấy top khách hàng
      const topCustomerData: ListTopCustomersResponse =
        await statisticalApi.topCustomer();
      // thống kê theo nằm nay
      const year = new Date().getFullYear();
      const monthlyRevenueData = await statisticalApi.monthlyRevenue(year);

      // Cập nhật thống kê tổng quan
      setStats([
        {
          label: "Tổng số hóa đơn trong ngày",
          value: 0, // Bạn có thể gọi API dailySummary nếu muốn số liệu chi tiết
          icon: FileText,
          color: "bg-gradient-to-br from-blue-600 to-blue-700",
          shadowColor: "shadow-blue-200",
          trend: "+0%",
          trendUp: true,
          exportFn: () => exportExcelApi.dailySummary(), // API export daily summary
        },
        {
          label: "Tổng số khách hàng",
          value: totalCustomer.data,
          icon: Users,
          color: "bg-gradient-to-br from-indigo-600 to-indigo-700",
          shadowColor: "shadow-indigo-200",
          trend: "+0%",
          trendUp: true,
          exportFn: () => exportExcelApi.totalCustomers(), // không có export
        },
        {
          label: "Tổng số gói hiện tại",
          value: totalPackage.data,
          icon: Package,
          color: "bg-gradient-to-br from-blue-500 to-blue-600",
          shadowColor: "shadow-blue-200",
          trend: "+0%",
          trendUp: true,
          exportFn: undefined,
        },
        {
          label: "Tổng số gói đang lỗi",
          value: tamperedInvoices.data,
          icon: AlertCircle,
          color: "bg-gradient-to-br from-red-500 to-red-600",
          shadowColor: "shadow-red-200",
          trend: "-0%",
          trendUp: false,
          exportFn: () => exportExcelApi.tamperedInvoices(),
        },
      ]);

      // Chuyển đổi packageByCategory.data sang mảng để vẽ PieChart
      const packageArr = Object.entries(packageByCategory.data).map(
        ([name, value]) => ({
          name,
          value,
        })
      );
      setPackageData(packageArr);

      // Cập nhật top khách hàng
      setTopCustomers(
        topCustomerData.data.map((c) => ({
          name: c.customerName,
          invoices: 0, // nếu có số lượng hóa đơn trong API có thể cập nhật
          revenue: c.totalRevenue,
        }))
      );

      if (monthlyRevenueData.succeeded) {
        // Chuyển dữ liệu API sang format cho biểu đồ
        const data: MonthlyRevenueData[] = Object.entries(
          monthlyRevenueData.data
        )
          .map(([month, revenue]) => ({
            month: `Th${month}`,
            revenue,
          }))
          .sort(
            (a, b) =>
              Number(a.month.replace("Th", "")) -
              Number(b.month.replace("Th", ""))
          );
        setChartData(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải dashboard:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData().finally(() => setRefreshing(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900">
            Quản lý Hóa đơn Điện tử
          </h1>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl shadow-md border border-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-700">
                {currentTime.toLocaleTimeString("vi-VN")}
              </span>
            </div>
            <button
              onClick={handleRefresh}
              className={`p-3 bg-white rounded-xl hover:bg-slate-50 transition-all duration-300 shadow-md border border-slate-200 hover:shadow-lg ${
                refreshing ? "animate-spin" : ""
              }`}
            >
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </button>
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:scale-105 font-medium"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                Xuất Excel
              </button>

              {exportMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                  <button
                    onClick={() =>
                      exportExcelApi
                        .dailySummary()
                        .finally(() => setExportMenuOpen(false))
                    }
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-t-xl"
                  >
                    Xuất tổng hợp ngày
                  </button>
                  <button
                    onClick={() =>
                      exportExcelApi
                        .monthlyRevenue(new Date().getFullYear())
                        .finally(() => setExportMenuOpen(false))
                    }
                    className="w-full text-left px-4 py-2 hover:bg-blue-50"
                  >
                    Xuất doanh thu theo tháng
                  </button>
                  <button
                    onClick={() =>
                      exportExcelApi
                        .topCustomers(5)
                        .finally(() => setExportMenuOpen(false))
                    }
                    className="w-full text-left px-4 py-2 hover:bg-blue-50"
                  >
                    Xuất top 5 khách hàng
                  </button>
                  <button
                    onClick={() =>
                      exportExcelApi
                        .packagesByCategory()
                        .finally(() => setExportMenuOpen(false))
                    }
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-b-xl"
                  >
                    Xuất tổng gói theo category
                  </button>
                  <button
                    onClick={async () => {
                      await exportExcelApi.dailySummary();
                      await exportExcelApi.monthlyRevenue(
                        new Date().getFullYear()
                      );
                      await exportExcelApi.topCustomers(5);
                      await exportExcelApi.packagesByCategory();
                      setExportMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 font-semibold"
                  >
                    Xuất tất cả
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 ${item.shadowColor} shadow-lg group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${item.color} p-3 rounded-xl shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded-lg ${
                      item.trendUp
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.trend}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-2 font-medium">
                  {item.label}
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {item.value.toLocaleString("vi-VN")}
                </p>

                {/* Nút xuất Excel */}
                {item.exportFn && (
                  <button
                    onClick={item.exportFn}
                    className="absolute bottom-4 right-4 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Biểu đồ PieChart gói */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 relative">
            {/* Tiêu đề và nút trong cùng 1 hàng */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Tổng các gói theo loại
              </h3>
              <button
                onClick={() => exportExcelApi.packagesByCategory()} // gọi API tải Excel
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={packageData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {packageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 relative">
            {/* Tiêu đề và nút cùng hàng */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  Doanh thu theo tháng
                </h3>
                <p className="text-slate-600 text-sm">6 tháng gần nhất</p>
              </div>
              <button
                onClick={() =>
                  exportExcelApi.monthlyRevenue(new Date().getFullYear())
                } // gọi API tải Excel
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  style={{ fontSize: "14px", fontWeight: 500 }}
                />
                <YAxis
                  stroke="#64748B"
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  }
                  style={{ fontSize: "14px" }}
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
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{ fontWeight: 600, color: "#1E40AF" }}
                />
                <Bar dataKey="revenue" radius={[12, 12, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top khách hàng */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 relative">
          {/* Tiêu đề và nút cùng hàng */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Top khách hàng
            </h3>
            <button
              onClick={() => exportExcelApi.topCustomers(5)} // gọi API tải Excel, top = 5
              className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl hover:shadow-md border border-slate-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {customer.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      {customer.invoices} hóa đơn
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-700">
                    {(customer.revenue / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
