import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PackageCard from "../components/Package/PackageCard";
import { Wallet, Clock, Wifi, MessageSquareText } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
          alt="Not found"
          className="w-40 mb-6 opacity-80"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Gói cước không tồn tại
        </h1>
        <p className="text-gray-500 mb-6">
          Có thể gói này đã bị gỡ hoặc bạn nhập sai đường dẫn.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#d6001c] text-white font-bold rounded-full px-8 py-3 hover:bg-[#b80019] transition-all duration-300"
        >
          Quay lại
        </button>
      </div>
    );
  }

  if (!pkgDetail) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 pb-28">
      {/* Tiêu đề */}
      <h1 className="text-4xl font-bold mb-8">
        <span className="text-red-600">{pkgDetail.packageName}</span>
      </h1>

      {/* --- SECTION 1: TÓM TẮT --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <SummaryCard
          icon={<Wallet className="w-6 h-6 text-[#d6001c]" />}
          label="Cước phí"
          value={`${pkgDetail.price.toLocaleString("vi-VN")}đ`}
        />
        <SummaryCard
          icon={<Clock className="w-6 h-6 text-[#d6001c]" />}
          label="Thời hạn sử dụng"
          value={
            pkgDetail.durationMonths === 0
              ? "1 ngày"
              : `${pkgDetail.durationMonths} tháng`
          }
        />
        <SummaryCard
          icon={<Wifi className="w-6 h-6 text-[#d6001c]" />}
          label="Dung lượng data 4G"
          value={pkgDetail.durationMonths.toString()}
          isHtml
        />
        <SummaryCard
          icon={<MessageSquareText className="w-6 h-6 text-[#d6001c]" />}
          label="Cú pháp đăng ký qua SMS"
          value={pkgDetail.durationMonths.toString()}
          isHtml
          highlight
        />
      </div>

      {/* --- SECTION 2: GIỚI THIỆU --- */}
      <div className="bg-white rounded-3xl shadow border border-gray-200 p-8 mb-8">
        <div className="prose prose-gray max-w-none mb-10">
          <h2 className="text-2xl font-bold mb-6">
            Giới thiệu{" "}
            <span className="text-red-600">{pkgDetail.packageName}</span>
          </h2>
          {/* {pkgDetail.description ? (
            <div dangerouslySetInnerHTML={{ __html: pkgDetail.description }} />
          ) : (
            <p className="text-gray-500 italic">
              {pkgDetail.description}
              Hiện chưa có mô tả cho gói cước này.
            </p>
          )} */}
        </div>

        {/* Chi tiết ưu đãi */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold mb-4">
            Chi tiết ưu đãi gói {pkgDetail.packageName}
          </h3>
          {pkgDetail.description?.length > 0 ? (
            <div
              dangerouslySetInnerHTML={{ __html: pkgDetail.description || "" }}
            />
          ) : (
            <p className="text-gray-500 italic">
              Chưa có thông tin chi tiết ưu đãi.
            </p>
          )}
        </div>

        {/* Nhà cung cấp
        <div>
          <h3 className="text-xl font-semibold mb-3">Đơn vị cung cấp</h3>
          {pkgDetail. ? (
            <>
              <p>
                <strong>{pkgDetail.provider_info.company}</strong>
              </p>
              <p>Địa chỉ: {pkgDetail.provider_info.address}</p>
              <p>Hotline: {pkgDetail.provider_info.hotline}</p>
              <p>
                Website:{" "}
                <a
                  href={pkgDetail.provider_info.website}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {pkgDetail.provider_info.website}
                </a>
              </p>
            </>
          ) : (
            <p className="text-gray-500 italic">
              Thông tin nhà cung cấp chưa được cập nhật.
            </p>
          )}
        </div> */}
      </div>

      {/* --- GÓI CƯỚC TƯƠNG TỰ ---
      <div className="mt-12">
        <h3 className="text-2xl font-extrabold text-gray-800 mb-8 tracking-wide uppercase">
          Gói cước tương tự
        </h3>
        {pkgDetail.similar_packages?.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pkgDetail.similar_packages.map((p: any) => (
              <PackageCard
                key={p.id}
                id={p.id}
                data={p.data}
                price={p.price}
                duration_months={pkgDetail.duration_months}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            Hiện chưa có gói tương tự nào được đề xuất.
          </p>
        )}
      </div> */}

      {/* --- STICKY FOOTER --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-3px_10px_rgba(0,0,0,0.05)] flex justify-between items-center px-10 py-5 z-50">
        <div className="pl-12">
          <p className="text-2xl font-extrabold text-gray-900">
            <span className="text-[#d6001c]">{pkgDetail.packageName}</span>
          </p>
          <p className="text-lg font-bold text-gray-800 mt-1">
            {pkgDetail.price.toLocaleString("vi-VN")}đ{" "}
            <span className="font-normal text-gray-500">
              /{" "}
              {pkgDetail.durationMonths === 0
                ? "ngày"
                : `${pkgDetail.durationMonths} tháng`}
            </span>
          </p>
        </div>
        <button
          className="bg-[#d6001c] text-white font-bold rounded-full px-10 py-3 
                     shadow-[0_6px_12px_rgba(214,0,28,0.4)] 
                     hover:shadow-[0_8px_16px_rgba(214,0,28,0.5)] 
                     hover:bg-[#b80019] active:scale-95 
                     transition-all duration-300 mr-12"
          onClick={() => navigate(`/payment?id=${pkgDetail.id}`)}
        >
          ĐĂNG KÝ
        </button>
      </div>
    </div>
  );
};

export default PackageDetail;

// ===== Component con gọn gàng cho phần summary =====
interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isHtml?: boolean;
  highlight?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  label,
  value,
  isHtml,
  highlight,
}) => (
  <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
    <div className="p-2 bg-[#fff1f2] rounded-full">{icon}</div>
    <div className="min-w-0">
      <p className="text-gray-500 text-sm">{label}</p>
      {isHtml ? (
        <div
          className={`text-lg font-bold truncate whitespace-nowrap ${
            highlight ? "text-[#d6001c]" : "text-gray-900"
          }`}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <p
          className={`text-lg font-bold truncate whitespace-nowrap ${
            highlight ? "text-[#d6001c]" : "text-gray-900"
          }`}
        >
          {value}
        </p>
      )}
    </div>
  </div>
);
