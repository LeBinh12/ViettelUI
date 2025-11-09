import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PackageCard from "../components/Package/PackageCard";
import { servicePackageDetailApi } from "../api";

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pkgDetail, setPkgDetail] = useState<any | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      if (!id) return;
      const data = await servicePackageDetailApi.getById(id);
      setPkgDetail(data);
    }
    fetchDetail();
  }, [id]);

  if (!pkgDetail) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Không tìm thấy gói cước
        </h2>
        <button
          className="px-6 py-2 bg-red-500 text-white rounded-lg"
          onClick={() => navigate("/")}
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Nút quay lại */}
      <button
        className="text-red-600 font-medium mb-4 flex items-center hover:underline"
        onClick={() => navigate("/")}
      >
        ← Quay lại
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Gói cước Viettel {pkgDetail.package_name}
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-center">
          <div className="border rounded-lg p-4">
            <p className="text-gray-500">Cước phí</p>
            <p className="text-xl font-semibold text-red-600">
              {pkgDetail.price.toLocaleString("vi-VN")}₫
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-gray-500">Thời hạn sử dụng</p>
            <p className="text-xl font-semibold text-gray-800">
              {pkgDetail.duration_months || 1} tháng
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-gray-500">Dung lượng data</p>
            <p className="text-xl font-semibold text-gray-800">
              {pkgDetail.data_info || "Không giới hạn"}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-gray-500">Cú pháp đăng ký</p>
            <p className="text-base font-semibold text-red-600">
              {pkgDetail.syntax_register}
            </p>
          </div>
        </div>

        <p className="text-gray-700">{pkgDetail.description}</p>
      </div>

      {/* Chi tiết ưu đãi */}
      <section className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-200">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900">Chi tiết ưu đãi</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          {pkgDetail.benefits?.map((b: string, i: number) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </section>

      {/* Điều kiện áp dụng */}
      <section className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-200">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900">Điều kiện áp dụng</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          {pkgDetail.terms?.map((t: string, i: number) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </section>

      {/* Câu hỏi thường gặp */}
      <section className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-200">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900">Câu hỏi thường gặp</h3>
        <div className="space-y-4">
          {pkgDetail.questions?.map((q: any, i: number) => (
            <div key={i} className="border rounded-lg p-4">
              <p className="font-semibold text-gray-800 mb-1">❓ {q.question}</p>
              <p className="text-gray-700">➡️ {q.answer}</p>
            </div>
          ))}
        </div>
      </section>

 {/* Gói tương tự */}
{pkgDetail.similar_packages && (
  <section className="bg-white rounded-2xl shadow p-6 mb-10 border border-gray-200 max-w-[1400px] mx-auto">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-semibold text-gray-900">Gói cước tương tự</h3>
      <button
        className="text-red-600 font-medium hover:underline"
        onClick={() => navigate("/")}
      >
        Xem tất cả →
      </button>
    </div>

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        xl:grid-cols-4
        2xl:grid-cols-5
        gap-x-8 gap-y-10
        justify-items-center
        w-full
      "
    >
      {pkgDetail.similar_packages.map((pkg: any) => (
        <PackageCard
          key={pkg.id}
          id={pkg.id}
          price={pkg.price}
          duration_months={pkg.duration_months}
          isDay={pkg.duration_months === 0}
        />
      ))}
    </div>
  </section>
)}




      

      {/* Footer */}
      {pkgDetail.provider_info && (
        <footer className="bg-gray-50 rounded-2xl shadow p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Đơn vị cung cấp</h3>
          <p>
            <strong>{pkgDetail.provider_info.company}</strong>
          </p>
          <p>Địa chỉ: {pkgDetail.provider_info.address}</p>
          <p>Hotline: {pkgDetail.provider_info.hotline}</p>
          <p>
            Website:{" "}
            <a
              href={pkgDetail.provider_info.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              {pkgDetail.provider_info.website}
            </a>
          </p>
        </footer>
      )}
    </div>
  );
};

export default PackageDetail;
