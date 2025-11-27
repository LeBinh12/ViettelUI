import { useNavigate } from "react-router-dom";
import { Monitor } from "lucide-react";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
            {/* Overlay mờ */}
            <div className="absolute inset-0 bg-red-500 bg-opacity-30 backdrop-blur-sm" />

            <div className="relative z-10 flex flex-col items-center text-center text-white px-6 animate-fadeIn">
                {/* Icon */}
                <div className="bg-white p-6 rounded-full shadow-lg mb-6">
                    <Monitor className="text-blue-600" size={60} />
                </div>

                {/* Tiêu đề */}
                <h1 className="text-8xl font-extrabold tracking-widest drop-shadow-lg">404</h1>
                <h2 className="mt-4 text-3xl font-bold">Oops! Trang không tồn tại</h2>
                <p className="mt-2 text-lg text-gray-200 max-w-md">
                    Trang bạn đang tìm kiếm không được tìm thấy.
                    Có thể đường dẫn sai hoặc trang đã bị xoá.
                </p>

                {/* Nút quay về */}
                <button
                    onClick={() => navigate("/")}
                    className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 active:scale-95"
                >
                    Quay về Trang Chủ
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
