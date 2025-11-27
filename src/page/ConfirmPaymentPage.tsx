import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { paymentApi } from "../api/paymentApi";
import { toast } from "react-toastify";
import { invoiceApi } from "../api/invoiceApi";

export default function ConfirmPaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState("");
  const [code, setCode] = useState("");
  //  Không có token thì đá về home
  useEffect(() => {
    if (!token) {
      //   navigate("/");
      return;
    }

    const confirmInvoice = async () => {
      console.log("token");
      try {
        const res = await paymentApi.confirm(token);
        console.log("res QR", res);
        if (!res.succeeded) {
          toast.error("Xác nhận thất bại: " + res.message);
          //   navigate("/");
          return;
        }

        // Nếu BE trả QR → dùng QR đó
        if (res.data) {
          setQrUrl(res.data);
          toast.success("Đã tạo mã QR thành công!");
        } else {
          toast.error("Không thể sinh mã QR");
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Lỗi QR");

        // navigate("/");
      }
    };

    confirmInvoice();
  }, [token, navigate]);

  const handleConfirm = async () => {
    if (!code.trim()) {
      toast.error("Vui lòng nhập mã xác thực!");
      return;
    }

    try {
      setLoading(true);
      // Gọi API xác nhận thanh toán với token + mã code
      const res = await invoiceApi.confirm(code); // giả sử backend nhận code ở đây
      console.log("res", res);
      if (res.succeeded) {
        toast.success("Thanh toán thành công!");
        // Có thể redirect sang trang thành công
        // navigate("/success");
      } else {
        toast.error("Xác nhận thất bại: " + res.message);
      }
      navigate("/");
    } catch (err: any) {
      console.error(err);
      toast.error("Lỗi khi xác nhận thanh toán");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Đang xử lý, vui lòng chờ...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* Ảnh QR từ DB hoặc invoiceId */}
      <img
        src={qrUrl}
        alt="QR Code"
        className="mb-6 border rounded-lg shadow-md"
      />

      {/* 2. Input mã xác thực */}
      <input
        type="text"
        placeholder="Nhập mã xác thực..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border rounded-md px-4 py-2 text-center w-64 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      {/* 3. Nút xác nhận */}
      <button
        onClick={handleConfirm}
        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md font-semibold transition"
      >
        Xác nhận thanh toán
      </button>
    </div>
  );
}
