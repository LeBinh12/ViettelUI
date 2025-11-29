import { useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function InvoiceSentScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-green-50 relative overflow-hidden">
      {/* Logo góc trái */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 flex items-center gap-2 z-20"
      >
        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
          <svg width="26" height="26" viewBox="0 0 48 48" fill="white">
            <path d="M24 8L30.928 18.286L42 20.382L33.6 28.528L35.856 40L24 34.286L12.144 40L14.4 28.528L6 20.382L17.072 18.286L24 8Z" />
          </svg>
        </div>
        <span className="text-xl font-extrabold text-green-600 tracking-wide">
          VIETDEV
        </span>
      </motion.div>

      {/* Nội dung thông báo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6 z-20"
      >
        <MailCheck className="text-green-600" size={80} />

        <h1 className="text-4xl font-extrabold text-green-700 text-center">
          Hóa đơn đã được gửi đến email của bạn
        </h1>

        <p className="text-center text-lg text-green-600 max-w-md">
          Vui lòng kiểm tra hộp thư đến và xác nhận email để hoàn tất quá trình.
          Nếu bạn không thấy email, hãy kiểm tra thư mục Spam hoặc Junk Mail.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 active:scale-95"
        >
          Quay về Trang Chủ
        </button>
      </motion.div>

      {/* Sóng nền */}
      <div className="absolute bottom-0 left-0 right-0 opacity-80">
        <svg viewBox="0 0 1440 320" className="w-full h-auto">
          <path fill="#D4F7D4" d="M0,224L1440,160L1440,320L0,320Z"></path>
          <path fill="#C1F5C1" d="M0,160L1440,96L1440,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
}
