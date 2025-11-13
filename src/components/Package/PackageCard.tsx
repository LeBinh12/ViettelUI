import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";

interface PackageCardProps {
  id: string;
  data?: string;
  price: number;
  duration_months?: number;
  isDay?: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({
  id,
  data = "6GB",
  price,
  duration_months = 1,
  isDay = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-md hover:shadow-lg transition-transform hover:scale-[1.03] p-6 flex flex-col items-center max-w-[340px] w-full mx-auto">
      {/* Header label */}
      <div className="self-start bg-red-600 text-white text-base font-semibold rounded-br-xl rounded-tl-xl px-4 py-1.5 mb-4 shadow-sm">
        {id.toUpperCase()}
      </div>

      {/* Dung lượng */}
      <h3 className="text-4xl font-extrabold text-red-600 mb-2 flex items-center whitespace-nowrap">
        {data}
        <span className="text-lg text-gray-800 ml-2">
          {isDay || duration_months === 0 ? "/ ngày" : "/ tháng"}
        </span>
      </h3>

      <p className="text-gray-500 text-base mb-4">Miễn phí</p>

      {/* MXH icons */}
      <div className="flex justify-center space-x-5 mb-5 text-red-600">
        <FaFacebook size={28} className="hover:scale-110 transition-transform" />
        <FaYoutube size={28} className="hover:scale-110 transition-transform" />
        <FaTiktok size={28} className="hover:scale-110 transition-transform" />
      </div>

      {/* Giá */}
      <div className="flex items-baseline justify-center mb-5">
        <span className="text-2xl font-bold text-gray-800 whitespace-nowrap">
          {price.toLocaleString("vi-VN")}₫
        </span>
        <span className="text-lg font-normal text-gray-600 ml-1 whitespace-nowrap">
          {isDay || duration_months === 0 ? "/ Ngày" : "/ Tháng"}
        </span>
      </div>


      {/* Nút */}
      <div className="flex w-full gap-3 mt-auto">
        <button className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 text-lg font-medium transition"  onClick={() => navigate(`/payment`)}>
          Đăng ký
        </button>
        <button
          className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
          onClick={() => navigate(`/package/${id}`)}
        >
          Chi tiết
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
