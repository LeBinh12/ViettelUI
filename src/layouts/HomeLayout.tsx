import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "../recoil/atoms/userAtom";
import {
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { BsArrowUpCircleFill, BsSearch } from "react-icons/bs";
import { useEffect, useState, type JSX } from "react";

export default function HomeLayout(): JSX.Element {
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const handleLogout = (): void => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo */}
         <div 
  className="flex items-center space-x-3 cursor-pointer" 
  onClick={() => navigate("/")}
>
  <img 
    src="/assets/logo.jpg" 
    alt="Chattrix Logo" 
    className="w-16 h-16 rounded-full shadow-md object-cover" 
  />
</div>



          {/* Navigation Menu */}
          <div className="flex-1 flex justify-center">
            <ul className="flex space-x-10 text-lg font-medium">
              {[
                { name: "Trang chủ", path: "/" },
                { name: "Tin tức", path: "/news" },
                { name: "Khuyến mãi", path: "/promotions" },
              ].map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `transition-colors ${
                        isActive
                          ? "text-[#e60023] font-semibold"
                          : "text-gray-800 hover:text-[#e60023]"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Search box + user */}
          <div className="flex items-center space-x-4">
            {/* Search box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-gray-700 w-48 sm:w-64"
              />
              <BsSearch className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>

            {/* User info */}
            {user && (
              <div className="text-gray-700 font-medium">{user.username}</div>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Đăng xuất
            </button>
          </div>
        </nav>
      </header>

      {/* Nội dung chính */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-10 relative">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1: Logo + mô tả + liên hệ */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <div className="flex items-center space-x-3">
              <img 
    src="/assets/logo.jpg" 
    alt="Chattrix Logo" 
    className="w-14 h-14 rounded-full shadow-md object-cover" 
  />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              Nền tảng cung cấp các gói dịch vụ Internet, combo ưu đãi, và giải
              pháp kết nối tốc độ cao — giúp bạn luôn online mọi lúc, mọi nơi.
            </p>

            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-blue-500" />
                <span>123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</span>
              </p>
              <p className="flex items-center space-x-2">
                <FaPhoneAlt className="text-blue-500" />
                <span>Hotline: 0909 888 999</span>
              </p>
              <p className="flex items-center space-x-2">
                <FaEnvelope className="text-blue-500" />
                <span>Email: support@vietdev.vn</span>
              </p>
            </div>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h4 className="text-gray-800 font-semibold text-lg mb-1">
              Liên kết nhanh
            </h4>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">
              Chính sách bảo mật
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">
              Điều khoản sử dụng
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">
              Liên hệ hỗ trợ
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">
              Hướng dẫn đăng ký gói
            </a>
          </div>

          {/* Cột 3: Mạng xã hội + Thanh toán */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div>
              <h4 className="text-gray-800 font-semibold text-lg mb-1">
                Kết nối với chúng tôi
              </h4>
              <p className="text-gray-600 text-sm mb-2">
                Theo dõi VietDev để nhận ưu đãi mới nhất.
              </p>
              <div className="flex space-x-4 text-gray-500">
                <a href="#" className="hover:text-blue-600 transition">
                  <FaFacebook size={22} />
                </a>
                <a href="#" className="hover:text-red-600 transition">
                  <FaYoutube size={22} />
                </a>
                <a href="#" className="hover:text-pink-500 transition">
                  <FaTiktok size={22} />
                </a>
              </div>
            </div>

            {/* Thanh toán */}
            <div>
              <h4 className="text-gray-800 font-semibold text-lg mb-2 flex items-center gap-2">
                Phương thức thanh toán
              </h4>
              <div className="flex flex-wrap gap-3 items-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                  alt="Visa"
                  className="h-6 hover:scale-110 transition-transform duration-200"
                />
                <img
                  src="https://i.pinimg.com/736x/e2/39/37/e2393766888f2c176def9d45dc78aa42.jpg"
                  alt="Mastercard"
                  className="h-6 hover:scale-110 transition-transform duration-200"
                />
                <img
                  src="https://i.pinimg.com/736x/ca/37/90/ca3790fd399e147c264411629640043e.jpg"
                  alt="MoMo"
                  className="h-6 hover:scale-110 transition-transform duration-200"
                />
                <img
                  src="https://i.pinimg.com/1200x/a4/45/6c/a4456c70a348cced98601a00e4050ca1.jpg"
                  alt="ZaloPay"
                  className="h-6 hover:scale-110 transition-transform duration-200"
                />
                <img
                  src="https://i.pinimg.com/736x/c2/96/da/c296daeda5b4473560e73a34f8d3e58b.jpg"
                  alt="PayPal"
                  className="h-6 hover:scale-110 transition-transform duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dòng bản quyền */}
        <div className="border-t border-gray-200 text-center py-4 text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-700">VietDev</span>. All
          rights reserved.
        </div>

        {/* Nút cuộn lên */}
        {showScrollTop && (
          <button
  onClick={scrollToTop}
  aria-label="Cuộn lên đầu trang"
  className="fixed bottom-6 right-6 text-blue-600 hover:text-blue-700 transition-transform duration-300 hover:scale-110"
>
  <BsArrowUpCircleFill size={45} />
  </button>
        )}
      </footer>
    </div>
  );
}
