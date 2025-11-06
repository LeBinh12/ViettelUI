import { useState } from "react";

export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Chào mừng đến với Trang chủ!
        </h2>
        <p className="text-gray-600 mb-6">
          Bạn đã đăng nhập thành công vào hệ thống.
        </p>

        <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
          <h3 className="text-2xl font-bold text-white">Bộ đếm</h3>
          <div className="text-5xl font-bold text-white">{count}</div>
          <button
            onClick={() => setCount(count + 1)}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition shadow-lg"
          >
            Tăng số đếm
          </button>
          <button
            onClick={() => setCount(0)}
            className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
          >
            Đặt lại
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Thống kê</h3>
          <p className="text-gray-600 text-sm">
            Xem các thống kê và báo cáo của bạn
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Cài đặt</h3>
          <p className="text-gray-600 text-sm">
            Quản lý cài đặt tài khoản của bạn
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tin nhắn</h3>
          <p className="text-gray-600 text-sm">Kiểm tra tin nhắn mới của bạn</p>
        </div>
      </div>
    </div>
  );
}
