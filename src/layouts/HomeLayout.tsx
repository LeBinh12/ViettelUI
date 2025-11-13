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
import { BsArrowUpCircleFill, BsSearch, BsSendFill } from "react-icons/bs";
import { useEffect, useState, type JSX } from "react";

export default function HomeLayout(): JSX.Element {
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [search, setSearch] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([
    { from: "bot", text: "Xin chào 👋! Mình là VietDev Chatbot, bạn cần hỗ trợ gì?" },
  ]);
  const [input, setInput] = useState("");

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

  const handleSend = (): void => {
    if (!input.trim()) return;
    const newMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Giả lập bot phản hồi
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Cảm ơn bạn! VietDev sẽ sớm phản hồi 😊" },
      ]);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="/assets/logo.jpg"
              alt="VietDev Logo"
              className="w-16 h-16 rounded-full shadow-md object-cover"
            />
          </div>

          {/* MENU */}
          <ul className="flex space-x-8 text-lg font-medium">
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

          {/* SEARCH + USER */}
          <div className="flex items-center space-x-4">
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
            {user && <div className="text-gray-700 font-medium">{user.username}</div>}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Đăng xuất
            </button>
          </div>
        </nav>
      </header>

      {/* MAIN */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-10 relative">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* CỘT 1 */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" >
          {/* Logo */}
          <img
            src="/assets/logo.jpg"
            alt="VietDev Logo"
            className="w-14 h-14 rounded-full shadow-md object-cover"
          />

          {/* Tên công ty bên phải logo */}
          <span className="text-2xl font-bold text-gray-800">
            Công Ty <span className="text-blue-600">VietDev</span>
          </span>
        </div>

            <p className="text-gray-600 text-sm max-w-xs text-center md:text-left">
              Nền tảng cung cấp các gói dịch vụ Internet, combo ưu đãi, và giải pháp kết nối tốc độ cao — giúp bạn luôn online mọi lúc, mọi nơi.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />
                <span>123 Nguyễn Văn Cừ, Q5, TP.HCM</span>
              </p>
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-blue-500" />
                <span>0909 888 999</span>
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-blue-500" />
                <span>support@vietdev.vn</span>
              </p>
            </div>
          </div>

          {/* CỘT 2 */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h4 className="text-gray-800 font-semibold text-lg">Liên kết nhanh</h4>
            {["Chính sách bảo mật", "Điều khoản sử dụng", "Liên hệ hỗ trợ", "Hướng dẫn đăng ký gói"].map((text) => (
              <a key={text} href="#" className="text-gray-600 hover:text-blue-600 transition">
                {text}
              </a>
            ))}
          </div>

          {/* CỘT 3 */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h4 className="text-gray-800 font-semibold text-lg">Kết nối với chúng tôi</h4>
            <p className="text-gray-600 text-sm">Theo dõi VietDev để nhận ưu đãi mới nhất.</p>
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
        </div>

        <div className="border-t border-gray-200 text-center py-4 text-sm text-gray-500">
          © {new Date().getFullYear()} <span className="font-semibold text-gray-700">VietDev</span>. All rights reserved.
        </div>

        {/* NÚT CHATBOT + SCROLLTOP */}
        <div className="fixed bottom-24 right-6 flex flex-col items-end space-y-3 z-50">
          {/* Chatbot */}
          <button
            onClick={() => setOpenChat(true)}
            aria-label="Chatbot hỗ trợ"
            className="relative group bg-gradient-to-tr from-blue-500 to-blue-600 p-5 rounded-full shadow-xl 
                       hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] transition-all duration-300 flex items-center justify-center"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-blue-500 blur-lg opacity-0 
                             group-hover:opacity-60 transition-all duration-500"></span>
            <div className="relative w-14 h-14 rounded-full bg-white p-1 shadow-inner flex items-center justify-center">
              <img
                src="https://i.pinimg.com/1200x/4b/d7/07/4bd7072385869677f9fd13154e536104.jpg"
                alt="Chatbot VietDev"
                className="w-12 h-12 object-contain rounded-full"
              />
            </div>
            <span className="absolute right-16 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm 
                             rounded-lg px-4 py-1.5 transition-all duration-300 whitespace-nowrap shadow-md">
              Chat với VietDev
            </span>
          </button>

          {/* Scroll Top */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              aria-label="Cuộn lên đầu trang"
              className="bg-gray-200 hover:bg-gray-300 text-blue-700 p-3 rounded-full shadow-md 
                         transition-all duration-300 hover:scale-110"
            >
              <BsArrowUpCircleFill size={30} />
            </button>
          )}
        </div>
      </footer>

      {/* MODAL CHAT */}
    {openChat && (
  <div className="fixed bottom-24 right-6 z-[60]">
    <div className="bg-white w-96 h-[520px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="https://i.pinimg.com/1200x/4b/d7/07/4bd7072385869677f9fd13154e536104.jpg"
            className="w-8 h-8 rounded-full"
            alt="VietDev Bot"
          />
          <span className="font-semibold">VietDev Chatbot</span>
        </div>
        <button
          onClick={() => setOpenChat(false)}
          className="text-white hover:text-gray-200 text-lg font-bold"
        >
          ✕
        </button>
      </div>

      {/* Chat nội dung */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-[80%] ${
                msg.from === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Nhập tin nhắn */}
      <div className="border-t border-gray-200 p-3 flex gap-2 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
            <button
      onClick={handleSend}
      aria-label="Gửi tin nhắn"
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center justify-center"
    >
      <BsSendFill size={18} />
    </button>

      </div>
    </div>
  </div>
)}

    </div>
  );
}
