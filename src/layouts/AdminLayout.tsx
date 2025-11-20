import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  LogOut,
  Menu,
  ChevronLeft,
} from "lucide-react";

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Sản phẩm", path: "/admin/products", icon: <Package size={20} /> },
    { name: "Người dùng", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Đơn hàng", path: "/admin/orders", icon: <ShoppingBag size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-22" : "w-64"
          } bg-white border-r border-gray-200 text-gray-800 flex flex-col fixed h-full shadow-sm transition-all duration-300`}
      >
        <div className="h-20 px-6 flex items-center justify-between border-b border-gray-200">

          {!collapsed && (
            <div className="text-xl font-extrabold tracking-wide">
              <span className="text-indigo-600">Viettel</span> Admin
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            {collapsed ? <Menu size={22} /> : <ChevronLeft size={22} />}
          </button>
        </div>


        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
                ${active
                    ? "bg-indigo-100 text-indigo-700 shadow-inner font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {item.icon}

                {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-lg font-medium text-white">
            <LogOut size={18} />
            {!collapsed && "Đăng xuất"}
          </button>
        </div>
      </aside>

      {/* Main Layout */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"
          }`}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 h-20 flex justify-end items-center sticky top-0 z-10">
          <span className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            Xin chào, <strong className="text-gray-900">Admin</strong>
          </span>
        </header>


        {/* Content */}
        <main className="flex-1 bg-gray-50 px-6 py-6">
          <div className="bg-white rounded-2xl shadow-md min-h-[500px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
