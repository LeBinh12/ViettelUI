import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  LogOut,
} from "lucide-react";

const AdminLayout: React.FC = () => {
  const location = useLocation();

  // Danh sách menu có icon
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Sản phẩm", path: "/admin/products", icon: <Package size={18} /> },
    { name: "Người dùng", path: "/admin/users", icon: <Users size={18} /> },
    { name: "Đơn hàng", path: "/admin/orders", icon: <ShoppingBag size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col fixed h-full shadow-lg">
        {/* Logo / Header */}
        <div className="p-5 text-2xl font-bold border-b border-blue-700 flex items-center justify-center tracking-wide">
          <span className="text-blue-300">Viettel</span>
          <span className="ml-1">Admin</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  active
                    ? "bg-blue-700 text-white shadow-inner"
                    : "text-gray-200 hover:bg-blue-700 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-700">
          <button className="w-full flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-700 transition px-4 py-2 rounded-lg font-medium">
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800">Bảng điều khiển</h1>
          <span className="text-sm text-gray-600">
            👋 Xin chào, <strong>Admin</strong>
          </span>
        </header>

        {/* Nội dung chính */}
        <main className="flex-1 bg-gray-50 px-6 py-6">
          <div className="bg-white rounded-2xl shadow p-6 min-h-[500px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
