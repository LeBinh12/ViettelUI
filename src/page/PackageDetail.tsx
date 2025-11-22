import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Wallet, Clock, Wifi, MessageSquareText, ArrowLeft } from "lucide-react";
import { servicePackageApi } from "../api";
import type { ServicePackageDTO } from "../types/servicePackage";

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkgDetail, setPkgDetail] = useState<ServicePackageDTO | null>(null);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchPackage = async () => {
      try {
        const res = await servicePackageApi.getById(id);

        if (res.succeeded && res.data) {
          setPkgDetail(res.data);
          setNotFound(false);
        } else {
          setPkgDetail(null);
          setNotFound(true);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết gói:", error);
        setPkgDetail(null);
        setNotFound(true);
      }
    };

    fetchPackage();
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-6xl">📦</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Gói cước không tồn tại
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">
            Có thể gói này đã bị gỡ hoặc bạn nhập sai đường dẫn.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-full px-10 py-4 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!pkgDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 pb-32">
      {/* Header với gradient đỏ */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white pt-8 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Quay lại</span>
          </button>
          
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            {pkgDetail.packageName}
          </h1>
          
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-extrabold">{pkgDetail.price.toLocaleString("vi-VN")}đ</span>
            <span className="text-xl text-white/90">
              / {pkgDetail.durationMonths === 0 ? "ngày" : `${pkgDetail.durationMonths} tháng`}
            </span>
          </div>
        </div>
      </div>

      {/* Thẻ summary cards nổi lên */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <SummaryCard
            icon={<Wallet className="w-7 h-7" />}
            label="Cước phí"
            value={`${pkgDetail.price.toLocaleString("vi-VN")}đ`}
          />
          <SummaryCard
            icon={<Clock className="w-7 h-7" />}
            label="Thời hạn"
            value={pkgDetail.durationMonths === 0 ? "1 ngày" : `${pkgDetail.durationMonths} tháng`}
          />
          <SummaryCard
            icon={<Wifi className="w-7 h-7" />}
            label="Dung lượng 4G"
            value="Không giới hạn"
          />
          <SummaryCard
            icon={<MessageSquareText className="w-7 h-7" />}
            label="Cú pháp SMS"
            value="DK GOI"
            highlight
          />
        </div>

        {/* Nội dung chính */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 mb-8">
          {/* Giới thiệu */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-8 bg-gradient-to-b from-red-600 to-red-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-800">
                Giới thiệu gói cước
              </h2>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="leading-relaxed">
                {pkgDetail.description || "Gói cước ưu đãi với nhiều tiện ích hấp dẫn dành cho khách hàng."}
              </p>
            </div>
          </div>

          {/* Chi tiết ưu đãi */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-8 bg-gradient-to-b from-red-600 to-red-500 rounded-full"></div>
              <h3 className="text-3xl font-bold text-gray-800">
                Chi tiết ưu đãi
              </h3>
            </div>
            
            {pkgDetail.description?.length > 0 ? (
              <div 
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: pkgDetail.description }}
              />
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <p className="text-gray-600 text-center italic">
                  Thông tin chi tiết sẽ được cập nhật sớm.
                </p>
              </div>
            )}
          </div>

          {/* Điều kiện áp dụng */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
            <h4 className="text-xl font-bold text-gray-800 mb-4">📋 Lưu ý quan trọng</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">•</span>
                <span>Gói cước tự động gia hạn hàng tháng</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">•</span>
                <span>Không giới hạn tốc độ trong gói cước</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">•</span>
                <span>Hỗ trợ khách hàng 24/7</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">Bạn đang chọn</p>
            <p className="text-2xl font-bold text-gray-900">
              {pkgDetail.packageName}
            </p>
            <p className="text-lg font-semibold text-red-600 mt-1">
              {pkgDetail.price.toLocaleString("vi-VN")}đ
              <span className="text-gray-500 font-normal text-base ml-1">
                / {pkgDetail.durationMonths === 0 ? "ngày" : `${pkgDetail.durationMonths} tháng`}
              </span>
            </p>
          </div>
          
          <button
            className="bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-full px-12 py-4 text-lg
                       shadow-[0_8px_20px_rgba(220,38,38,0.4)] 
                       hover:shadow-[0_12px_28px_rgba(220,38,38,0.5)] 
                       hover:scale-105 active:scale-95 
                       transition-all duration-300"
            onClick={() => navigate(`/payment?id=${pkgDetail.id}`)}
          >
            ĐĂNG KÝ NGAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;

// Component SummaryCard với design mới
interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  label,
  value,
  highlight,
}) => (
  <div className={`bg-white rounded-2xl shadow-lg border-2 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
    highlight ? 'border-red-500 bg-gradient-to-br from-red-50 to-white' : 'border-gray-100'
  }`}>
    <div className={`inline-flex p-3 rounded-xl mb-4 ${
      highlight ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'
    }`}>
      {icon}
    </div>
    <p className="text-gray-600 text-sm mb-2 font-medium">{label}</p>
    <p className={`text-xl font-bold ${highlight ? 'text-red-600' : 'text-gray-900'}`}>
      {value}
    </p>
  </div>
);