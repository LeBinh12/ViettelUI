import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

// Logo Viettel hiện đại (style đơn giản – tinh tế)
const ViettelLogo = () => (
  <div className="flex items-center gap-2">
    <svg width="40" height="40" viewBox="0 0 48 48">
      <rect width="48" height="48" rx="12" fill="#E60000" />
      <path
        d="M24 8L30.9 18.3L42 20.4L33.6 28.5L35.8 40L24 34.3L12.1 40L14.4 28.5L6 20.4L17.1 18.3L24 8Z"
        fill="white"
      />
    </svg>
    <span className="text-3xl font-extrabold tracking-wide text-[#E60000]">
      VIETTEL
    </span>
  </div>
);

export default function AuthLayout() {
  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-[#fff5f5] via-white to-[#ffe6e6] overflow-hidden">

      {/* Sóng nền nhẹ nhàng phía sau */}
      <div className="absolute inset-0 opacity-25">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 560"
          preserveAspectRatio="none"
        >
          <path
            fill="#FF6B6B"
            d="M0,320L80,298.7C160,277,320,235,480,213.3C640,192,800,192,960,208C1120,224,1280,256,1360,272L1440,288L1440,560H0Z"
          ></path>
        </svg>
      </div>

      {/* Logo Viettel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-6 left-8 z-20"
      >
        <ViettelLogo />
      </motion.div>

      {/* Form login/register */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-red-100 p-6">
            <Outlet />
          </div>
        </motion.div>
      </div>

      {/* Chấm trang trí tối giản */}
      <div className="absolute bottom-12 right-16 flex flex-col items-end space-y-3 opacity-60">
        <div className="w-16 h-16 bg-red-200 rounded-full"></div>
        <div className="w-10 h-10 bg-red-300 rounded-full -mr-6"></div>
        <div className="w-12 h-12 bg-red-500 rounded-full mr-3"></div>
      </div>

    </main>
  );
}
