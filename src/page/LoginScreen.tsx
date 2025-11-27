import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LoginScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const existsToken = localStorage.getItem("access_token_viettel");

    if (existsToken) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
      return;
    }

    if (token) {
      localStorage.setItem("access_token_viettel", token);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50 relative overflow-hidden flex items-center justify-center">
      {/* Loading ở giữa */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-4 z-20"
      >
        {/* Vòng loading */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full"
        />

        {/* Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold text-red-600 tracking-wide"
        >
          Đang xử lý…
        </motion.div>
      </motion.div>

      {/* Logo Viettel góc trái */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 flex items-center gap-2 z-20"
      >
        <div className="w-10 h-10 bg-[#E60000] rounded-xl flex items-center justify-center shadow-md">
          <svg width="26" height="26" viewBox="0 0 48 48" fill="white">
            <path d="M24 8L30.928 18.286L42 20.382L33.6 28.528L35.856 40L24 34.286L12.144 40L14.4 28.528L6 20.382L17.072 18.286L24 8Z" />
          </svg>
        </div>
        <span className="text-xl font-extrabold text-[#E60000] tracking-wide">
          VIETDEV
        </span>
      </motion.div>

      {/* Sóng nền */}
      <div className="absolute bottom-0 left-0 right-0 opacity-80">
        <svg viewBox="0 0 1440 320" className="w-full h-auto">
          <path fill="#FFE5E5" d="M0,224L1440,160L1440,320L0,320Z"></path>
          <path fill="#FFD6D6" d="M0,160L1440,96L1440,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
}
