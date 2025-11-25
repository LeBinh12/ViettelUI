import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function LoginScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("access_token_viettel", token);
    }
    // Delay nhẹ cho user thấy loading
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      <p className="text-gray-700 text-lg font-medium">
        Đang xử lý đăng nhập...
      </p>
    </div>
  );
}
