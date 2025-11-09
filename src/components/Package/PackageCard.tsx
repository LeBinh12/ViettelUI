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
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-4 flex flex-col items-center">
      {/* Header label */}
      <div className="self-start bg-red-600 text-white text-sm font-semibold rounded-br-lg rounded-tl-lg px-3 py-1 mb-3">
        {id.toUpperCase()}
      </div>

      {/* Dung lượng */}
      <h3 className="text-2xl font-bold text-red-600 mb-1 flex items-center whitespace-nowrap">
        {data}
        <span className="text-base text-gray-800 ml-1">
          {isDay || duration_months === 0 ? "/ ngày" : "/ tháng"}
        </span>
      </h3>
      <p className="text-gray-500 text-sm mb-3">Miễn phí</p>

      {/* MXH icons */}
      <div className="flex justify-center space-x-3 mb-3 text-red-600">
        <FaFacebook size={20} className="hover:scale-110 transition-transform" />
        <FaYoutube size={20} className="hover:scale-110 transition-transform" />
        <FaTiktok size={20} className="hover:scale-110 transition-transform" />
      </div>

      {/* Giá */}
      <p className="text-lg font-semibold text-gray-800 mb-4">
        {price.toLocaleString("vi-VN")}₫{" "}
        <span className="text-sm font-normal text-gray-600">
          {isDay || duration_months === 0 ? "/ Ngày" : "/ Tháng"}
        </span>
      </p>

      {/* Nút */}
      <div className="flex w-full gap-2">
        <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
          Mua
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
