import { Outlet, useNavigate, NavLink } from "react-router-dom";
import {
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { BsArrowUpCircleFill, BsSearch, BsSendFill } from "react-icons/bs";
import { useEffect, useState, type JSX, useRef } from "react";
import { geminiApi } from "../api/geminiApi";
import type { ServicePackage } from "../types/gemini";
import { servicePackageApi } from "../api/servicePackage.api";
import { toast } from "react-toastify";
import { customerApi } from "../api/customerApi";
import { useRecoilState, useRecoilValue } from "recoil";
import { customerAtom } from "../recoil/atoms/userAtom";
import { Package, X } from "lucide-react";

interface Message {
  from: "user" | "bot";
  text: string;
}

export default function HomeLayout(): JSX.Element {
  const [customer, setCustomer] = useRecoilState(customerAtom);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [method, setMethod] = useState<"email-link" | "password">("email-link");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [search, setSearch] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Xin chào 👋! Mình là VietDev Chatbot, bạn cần hỗ trợ gì?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(
    null
  );
  const chatEndRef = useRef<HTMLDivElement>(null);

  // HÀM XỬ LÝ ĐĂNG NHẬP RIÊNG BIỆT - CÓ LOG DỮ LIỆU RA CONSOLE
  const handleLoginSubmit = async () => {
    // Kiểm tra email hợp lệ
    if (!email || !email.includes("@") || !email.includes(".")) {
      toast.error("Vui lòng nhập email hợp lệ!");
      return;
    }

    // Nếu chọn nhập mật khẩu mà chưa nhập
    if (method === "password" && !password) {
      toast.error("Vui lòng nhập mật khẩu!");
      return;
    }

    setIsLoading(true);

    try {
      // Đăng nhập thông qua email xác nhận

      if (method === "email-link") {
        try {
          const res = await customerApi.loginMagic(email);
          if (res.code != 200) {
            toast.error(`Lỗi: ${res.message}`);
            console.log(res.message);
          }
          toast.success(`${res.data}`);
        } catch (err: any) {
          toast.success("Lỗi hệ thống");
          console.log(err);
        }
      } else {
        try {
          const res = await customerApi.login({ email, password });
          if (res.code != 200) {
            toast.error(`Lỗi: ${res.message}`);
            console.log(res.message);
          }
          localStorage.setItem("access_token_viettel", res.data);

          toast.success("Đăng nhập thành công!");
        } catch (err: any) {
          toast.success("Lỗi hệ thống");
          console.log(err);
        }
      }

      // Đóng modal sau khi thành công
      setTimeout(() => {
        setIsLoading(false);
        setShowLoginModal(false);
        setEmail("");
        setPassword("");
        setMethod("email-link");
      }, 1800);
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      toast.error(error?.message || "Đăng nhập thất bại. Vui lòng thử lại!");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Xử lý click vào gói dịch vụ
  const handlePackageClick = async (packageId: string): Promise<void> => {
    try {
      const response = await servicePackageApi.getById(packageId);
      if (response.succeeded && response.data) {
        setSelectedPackage(response.data);
      }
    } catch (error) {
      console.error("Error fetching package:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Xin lỗi, không thể tải thông tin gói này!" },
      ]);
    }
  };

  // Parse text có chứa [PACKAGE:ID|NAME]
  const parsePackageLinks = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    const regex = /\[PACKAGE:([^\|]+)\|([^\]]+)\]/g;
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
      // Thêm text trước match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const packageId = match[1];
      const packageName = match[2];

      // Tạo button cho gói
      parts.push(
        <button
          key={`pkg-${key++}`}
          onClick={() => handlePackageClick(packageId)}
          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium transition-all hover:shadow-md mx-1"
        >
          {packageName}
        </button>
      );

      lastIndex = regex.lastIndex;
    }

    // Thêm phần còn lại
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  // Hàm định dạng tin nhắn từ AI
  const formatMessage = (text: string): JSX.Element => {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        elements.push(<div key={`empty-${index}`} className="h-2"></div>);
        return;
      }

      // Tiêu đề
      if (trimmedLine.startsWith("###")) {
        const content = trimmedLine.replace(/^###\s*/, "");
        elements.push(
          <h3
            key={index}
            className="text-base font-bold text-gray-900 mt-3 mb-2"
          >
            {parsePackageLinks(content)}
          </h3>
        );
        return;
      }

      if (trimmedLine.startsWith("##")) {
        const content = trimmedLine.replace(/^##\s*/, "");
        elements.push(
          <h2 key={index} className="text-lg font-bold text-gray-900 mt-3 mb-2">
            {parsePackageLinks(content)}
          </h2>
        );
        return;
      }

      if (trimmedLine.startsWith("#")) {
        const content = trimmedLine.replace(/^#\s*/, "");
        elements.push(
          <h1 key={index} className="text-xl font-bold text-gray-900 mt-4 mb-2">
            {parsePackageLinks(content)}
          </h1>
        );
        return;
      }

      // Bullet points
      if (trimmedLine.startsWith("*") || trimmedLine.startsWith("-")) {
        const content = trimmedLine.replace(/^[\*\-]\s*/, "");
        const formatted = formatInlineStyles(content);
        elements.push(
          <div key={index} className="flex gap-2 my-1 ml-2">
            <span className="text-blue-600 mt-1">•</span>
            <span className="flex-1">{formatted}</span>
          </div>
        );
        return;
      }

      // Numbered list
      const numberedMatch = trimmedLine.match(/^(\d+)\.\s*(.+)/);
      if (numberedMatch) {
        const [, number, content] = numberedMatch;
        const formatted = formatInlineStyles(content);
        elements.push(
          <div key={index} className="flex gap-2 my-1 ml-2">
            <span className="text-blue-600 font-semibold">{number}.</span>
            <span className="flex-1">{formatted}</span>
          </div>
        );
        return;
      }

      // Text thường - có thể chứa package links
      const formatted = formatInlineStyles(trimmedLine);
      elements.push(
        <p key={index} className="my-1.5 leading-relaxed">
          {formatted}
        </p>
      );
    });

    return <div className="space-y-1">{elements}</div>;
  };

  // Hàm xử lý bold, italic, code inline và package links
  const formatInlineStyles = (text: string): JSX.Element => {
    // Trước tiên parse package links
    const withPackageLinks = parsePackageLinks(text);

    const parts: (string | JSX.Element)[] = [];
    let key = 0;

    withPackageLinks.forEach((segment, segIndex) => {
      if (typeof segment !== "string") {
        parts.push(segment);
        return;
      }

      // Xử lý markdown trong text
      let currentIndex = 0;
      const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|`([^`]+)`/g;
      let match;

      while ((match = regex.exec(segment)) !== null) {
        if (match.index > currentIndex) {
          parts.push(segment.substring(currentIndex, match.index));
        }

        if (match[1]) {
          parts.push(
            <strong
              key={`bold-${segIndex}-${key++}`}
              className="font-semibold text-gray-900"
            >
              {match[2]}
            </strong>
          );
        } else if (match[3]) {
          parts.push(
            <em key={`italic-${segIndex}-${key++}`} className="italic">
              {match[4]}
            </em>
          );
        } else if (match[5]) {
          parts.push(
            <code
              key={`code-${segIndex}-${key++}`}
              className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600"
            >
              {match[5]}
            </code>
          );
        }

        currentIndex = regex.lastIndex;
      }

      if (currentIndex < segment.length) {
        parts.push(segment.substring(currentIndex));
      }
    });

    return <>{parts}</>;
  };

  const handleSend = async (): Promise<void> => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    const newMsg: Message = { from: "user", text: userMessage };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await geminiApi.response(userMessage);

      setIsTyping(false);

      if (response.succeeded && response.data) {
        setMessages((prev) => [...prev, { from: "bot", text: response.data }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau!",
          },
        ]);
      }
    } catch (error) {
      setIsTyping(false);
      console.error("Gemini API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại!",
        },
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token_viettel");
    setCustomer(null);
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/search?keyword=${encodeURIComponent(search)}`);
    setIsSearchOpen(false); // Đóng thanh tìm kiếm sau khi tìm
    setSearch(""); // Xóa nội dung
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
              { name: "Tra cứu gói cước", path: "/PackageLookup" },
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
            {/* SEARCH - Mở rộng mượt mà, nằm cùng hàng header */}
            <div className="relative flex items-center">
              {/* Icon kính lúp + nút toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-all duration-300 z-10"
              >
                <BsSearch className="text-gray-600" size={22} />
              </button>

              {/* Thanh input mở rộng từ phải sang trái */}
              <div
                className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden transition-all duration-500 ease-in-out ${
                  isSearchOpen ? "w-96 opacity-100" : "w-0 opacity-0"
                }`}
              >
                {/* Icon kính lúp trong input */}
                <div className="pl-5 pr-3">
                  <Package />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && search.trim()) handleSearch();
                    if (e.key === "Escape") {
                      setIsSearchOpen(false);
                      setSearch("");
                    }
                  }}
                  placeholder="Tìm gói cước, khuyến mãi, tin tức..."
                  className="w-full py-3 pr-16 outline-none text-gray-800 placeholder-gray-400"
                  autoFocus={isSearchOpen}
                />
              </div>
            </div>
            {customer ? (
              <div className="flex items-center gap-4">
                <div className="text-gray-700 font-medium">
                  {customer.email}
                </div>

                <button
                  onClick={() => handleLogout()}
                  className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-full transition-all"
                >
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Đăng Nhập
              </button>
            )}

            {/* MODAL ĐĂNG NHẬP / ĐĂNG KÝ - DÁN SAU </footer> và TRƯỚC các modal khác */}
            {/* MODAL ĐĂNG NHẬP - 2 PHƯƠNG THỨC */}
            {showLoginModal && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                  {/* Header đỏ Viettel */}
                  <div className="bg-gradient-to-br from-red-600 via-red-600 to-red-700 text-white p-8 relative">
                    <button
                      onClick={() => {
                        setShowLoginModal(false);
                        setEmail("");
                        setPassword("");
                        setMethod("email-link");
                      }}
                      className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center transition"
                    >
                      <span className="text-2xl">×</span>
                    </button>

                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2">
                        Chào mừng trở lại!
                      </h2>
                      <p className="text-red-100 text-lg">
                        Đăng nhập để tiếp tục sử dụng dịch vụ
                      </p>
                    </div>
                  </div>

                  {/* Chọn phương thức đăng nhập */}
                  <div className="px-8 pt-6">
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      <button
                        onClick={() => setMethod("email-link")}
                        className={`py-4 px-6 rounded-2xl font-semibold transition-all duration-300 border-2 ${
                          method === "email-link"
                            ? "bg-red-50 border-red-600 text-red-700 shadow-lg shadow-red-100"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-sm font-medium">
                          Gửi link đăng nhập
                        </div>
                      </button>

                      <button
                        onClick={() => setMethod("password")}
                        className={`py-4 px-6 rounded-2xl font-semibold transition-all duration-300 border-2 ${
                          method === "password"
                            ? "bg-red-50 border-red-600 text-red-700 shadow-lg shadow-red-100"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-sm font-medium">Nhập mật khẩu</div>
                      </button>
                    </div>

                    {/* Form theo phương thức */}
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email của bạn
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nhập email@example.com"
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-red-600 focus:ring-4 focus:ring-red-100 transition text-lg"
                          autoFocus
                        />
                      </div>

                      {method === "password" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-red-600 focus:ring-4 focus:ring-red-100 transition text-lg"
                          />
                          <a
                            href="#"
                            className="text-sm text-red-600 hover:underline mt-2 inline-block"
                          >
                            Quên mật khẩu?
                          </a>
                        </div>
                      )}

                      <button
                        onClick={handleLoginSubmit} // Thay bằng hàm mới
                        disabled={isLoading || !email.includes("@")}
                        className="w-full py-5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xl font-bold rounded-2xl hover:from-red-700 hover:to-red-800 transform hover:-translate-y-1 transition-all duration-300 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin h-6 w-6 text-white"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Đang xử lý...
                          </>
                        ) : method === "email-link" ? (
                          "Gửi link đăng nhập"
                        ) : (
                          "Đăng nhập"
                        )}
                      </button>

                      {method === "email-link" && (
                        <p className="text-center text-sm text-gray-600 mt-4">
                          Chúng tôi sẽ gửi một{" "}
                          <strong>liên kết đăng nhập an toàn</strong> đến email
                          của bạn.
                          <br />
                          Không cần mật khẩu, chỉ cần 1 click!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 px-8 py-5 text-center text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
                    <a
                      href="mailto:support@vietdev.vn"
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Liên hệ hỗ trợ tạo tài khoản
                    </a>
                  </div>
                </div>
              </div>
            )}
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
            <div className="flex items-center space-x-3 cursor-pointer">
              <img
                src="/assets/logo.jpg"
                alt="VietDev Logo"
                className="w-14 h-14 rounded-full shadow-md object-cover"
              />
              <span className="text-2xl font-bold text-gray-800">
                Công Ty <span className="text-blue-600">VietDev</span>
              </span>
            </div>

            <p className="text-gray-600 text-sm max-w-xs text-center md:text-left">
              Nền tảng cung cấp các gói dịch vụ Internet, combo ưu đãi, và giải
              pháp kết nối tốc độ cao — giúp bạn luôn online mọi lúc, mọi nơi.
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
            <h4 className="text-gray-800 font-semibold text-lg">
              Liên kết nhanh
            </h4>
            {[
              "Chính sách bảo mật",
              "Điều khoản sử dụng",
              "Liên hệ hỗ trợ",
              "Hướng dẫn đăng ký gói",
            ].map((text) => (
              <a
                key={text}
                href="#"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                {text}
              </a>
            ))}
          </div>

          {/* CỘT 3 */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h4 className="text-gray-800 font-semibold text-lg">
              Kết nối với chúng tôi
            </h4>
            <p className="text-gray-600 text-sm">
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
        </div>

        <div className="border-t border-gray-200 text-center py-4 text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-700">VietDev</span>. All
          rights reserved.
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
            <span
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-blue-500 blur-lg opacity-0 
                             group-hover:opacity-60 transition-all duration-500"
            ></span>
            <div className="relative w-14 h-14 rounded-full bg-white p-1 shadow-inner flex items-center justify-center">
              <img
                src="https://i.pinimg.com/1200x/4b/d7/07/4bd7072385869677f9fd13154e536104.jpg"
                alt="Chatbot VietDev"
                className="w-12 h-12 object-contain rounded-full"
              />
            </div>
            <span
              className="absolute right-16 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm 
                             rounded-lg px-4 py-1.5 transition-all duration-300 whitespace-nowrap shadow-md"
            >
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
                    className={`px-3 py-2 rounded-lg max-w-[85%] ${
                      msg.from === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100"
                    }`}
                  >
                    {msg.from === "bot" ? formatMessage(msg.text) : msg.text}
                  </div>
                </div>
              ))}

              {/* Hiệu ứng typing */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Nhập tin nhắn */}
            <div className="border-t border-gray-200 p-3 flex gap-2 bg-white">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Nhập tin nhắn..."
                disabled={isTyping}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                aria-label="Gửi tin nhắn"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                <BsSendFill size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT GÓI */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-[fadeIn_0.3s_ease]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Chi tiết gói dịch vụ</h2>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedPackage.packageName}
                </h3>
                {selectedPackage.category && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {selectedPackage.category.name}
                  </span>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Giá:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedPackage.price.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Thời hạn:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {selectedPackage.durationMonths} tháng
                  </span>
                </div>

                <div>
                  <span className="text-gray-600 font-medium block mb-2">
                    Mô tả:
                  </span>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {selectedPackage.description}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setSelectedPackage(null);
                    navigate("/PackageLookup");
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
                >
                  Đăng ký ngay
                </button>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
