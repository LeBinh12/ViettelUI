import { useState } from "react";

export default function ConfirmPaymentPage() {
    const [code, setCode] = useState("");

    const handleConfirm = () => {
        if (!code.trim()) {
            alert("Vui lòng nhập mã xác thực!");
            return;
        }

        alert("Thanh toán thành công! Mã xác thực: " + code);
        // Nếu muốn chuyển trang:
        // window.location.href = "/success";
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4"
            style={{ fontFamily: "sans-serif" }}>

            {/* 1. Ảnh QR */}
            <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=PAYMENT"
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
