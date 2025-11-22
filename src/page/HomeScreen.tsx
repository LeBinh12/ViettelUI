import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import { Wifi, PhoneCall, Tv, Sparkles } from "lucide-react";
import { categoryApi, servicePackageApi } from "../api";
import PackageCard from "../components/Package/PackageCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { ServicePackageDTO } from "../types/servicePackage";
import type { CategoryDTO } from "../types/category";

const bannerImages = [
  "https://i.pinimg.com/1200x/3e/27/81/3e27812a61e5c3202ee93231fd532190.jpg",
  "https://i.pinimg.com/736x/db/8a/e5/db8ae51f60723fca4fd2218925c859e8.jpg",
  "https://i.pinimg.com/736x/79/de/fe/79defeb2be148dd85f1766df6425fee1.jpg",
];

const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [packages, setPackages] = useState<ServicePackageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sliderRef = useRef<any>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const bannerSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
    beforeChange: () => setProgress(0),
    afterChange: (index: number) => setCurrentSlide(index),
  };

  useEffect(() => {
    const timer = setInterval(
      () => setProgress((p) => Math.min(p + 2, 100)),
      100
    );
    return () => clearInterval(timer);
  }, [currentSlide]);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError(null);

      try {
        const categoriesRes = await categoryApi.getAllCategory();

        if (!categoriesRes.succeeded) {
          throw new Error(categoriesRes.message || "Không thể tải danh mục");
        }

        setCategories(categoriesRes.data);

        if (categoriesRes.data.length > 0) {
          setActiveTab(categoriesRes.data[0].id);
        }
      } catch (err) {
        console.error("Lỗi tải categories:", err);
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeTab) return;

    async function fetchPackages() {
      setLoadingPackages(true);

      try {
        const packagesRes = await servicePackageApi.getByCategory(
          activeTab ?? ""
        );

        if (packagesRes.succeeded) {
          setPackages(packagesRes.data);
        } else {
          setPackages([]);
        }
      } catch (err) {
        console.error("Lỗi tải packages:", err);
        setPackages([]);
      } finally {
        setLoadingPackages(false);
      }
    }

    fetchPackages();
  }, [activeTab]);

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, j) => (
        <div
          key={j}
          className="relative overflow-hidden bg-white rounded-3xl shadow-2xl border-2 border-gray-100"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-100 via-white to-red-50 animate-pulse"></div>
          <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
          <div className="p-6 space-y-4">
            <div className="h-7 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
            <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3 animate-pulse"></div>
            <div className="h-10 bg-gradient-to-r from-red-200 to-red-300 rounded-xl animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative bg-white min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-red-600/10 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-0 left-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-red-400/10 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
      </div>

      {/* ULTRA MODERN BANNER */}
      <div className="relative w-full h-[350px] md:h-[450px] lg:h-[550px] mb-20 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white z-10"></div>
        
        <Slider ref={sliderRef} {...bannerSettings}>
          {bannerImages.map((img, idx) => (
            <div key={idx} className="relative">
              <div className="relative h-[550px] md:h-[650px] lg:h-[750px]">
                <img
                  src={img}
                  alt={`Banner ${idx + 1}`}
                  className={`w-full h-full object-cover transition-all duration-[8000ms] ease-out ${
                    currentSlide === idx ? "scale-110 brightness-90" : "scale-100 brightness-75"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-red-600/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>
            </div>
          ))}
        </Slider>

        {/* Banner Content Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-red-400 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
              <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-red-50 to-white">
                  Trải Nghiệm
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-3xl font-semibold text-white/95 mb-8 tracking-wide">
              Dịch vụ đẳng cấp - Giá trị vượt trội
            </p>
            <div className="flex gap-4 justify-center">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-2xl overflow-hidden shadow-2xl shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 transform hover:scale-105">
                <span className="relative z-10">Khám phá ngay</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>

        {/* Modern Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 px-8 pb-6">
          <div className="relative h-2 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-full shadow-lg shadow-red-500/50 transition-all duration-100"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-40 left-20 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* ULTRA MODERN CATEGORY SECTION */}
        <div className="mb-16 relative">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full"></div>
              <div className="mx-4 w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
              <div className="mx-4 w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="h-1 w-16 bg-gradient-to-l from-transparent via-red-500 to-transparent rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-red-600 to-gray-900">
                Danh Mục Dịch Vụ
              </span>
            </h2>
            <p className="text-gray-600 text-lg">Chọn danh mục phù hợp với nhu cầu của bạn</p>
          </div>

          {/* Category Pills */}
          <div className="flex justify-center items-center flex-wrap gap-4">
            {loading ? (
              <div className="flex gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-40 h-16 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-2xl"
                  ></div>
                ))}
              </div>
            ) : (
              categories.map((category, idx) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  className={`group relative px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-110 animate-fadeInUp ${
                    activeTab === category.id
                      ? "bg-gradient-to-br from-red-600 via-red-500 to-red-600 text-white shadow-2xl shadow-red-500/40"
                      : "bg-white text-gray-700 hover:text-red-600 shadow-xl hover:shadow-2xl border-2 border-gray-100 hover:border-red-200"
                  }`}
                >
                  {/* Animated background for active state */}
                  {activeTab === category.id && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl animate-shimmer-slow"></div>
                    </>
                  )}
                  
                  <span className="relative z-10 flex items-center gap-2">
                    {category.name}
                    {activeTab === category.id && (
                      <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    )}
                  </span>

                  {/* Bottom indicator */}
                  {activeTab === category.id && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                      <div className="w-4 h-4 bg-red-500 rotate-45 shadow-lg"></div>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* MODERN ERROR STATE */}
        {error && (
          <div className="relative bg-gradient-to-br from-red-50 via-white to-red-50 border-2 border-red-200 rounded-3xl p-10 text-center mb-16 overflow-hidden shadow-2xl animate-fadeIn">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.1),transparent)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(239,68,68,0.1),transparent)]"></div>
            
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-500/30 animate-bounce-slow transform rotate-12">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-3">Oops! Có lỗi xảy ra</h3>
              <p className="text-gray-700 text-lg mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="group relative px-10 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Thử lại
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>
        )}

        {/* PACKAGES GRID */}
        <div className="relative">
          {loadingPackages ? (
            <SkeletonLoader />
          ) : packages.length === 0 ? (
            <div className="text-center py-32 animate-fadeIn">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-red-50 to-red-100 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6">
                  <svg
                    className="w-16 h-16 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-3">
                Chưa có gói cước nào
              </h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Danh mục này hiện chưa có gói cước. Hãy thử chọn danh mục khác nhé!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  className="transform hover:scale-105 transition-all duration-500 hover:-translate-y-2"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className="relative group">
                    {/* Glow effect on hover */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-red-600 to-red-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="relative">
                      <PackageCard
                        id={pkg.id}
                        data={pkg.packageName}
                        price={pkg.price}
                        duration_months={pkg.durationMonths}
                        isDay={pkg.durationMonths === 0}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
{/* SERVICE INTRODUCTION SECTION */}
<div className="mt-32 relative">
  <div className="text-center mb-12">
    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-red-600 to-gray-900">
        Giới Thiệu Dịch Vụ Viettel
      </span>
    </h2>
    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
      Viettel cung cấp đa dạng dịch vụ viễn thông nhằm mang đến trải nghiệm tốt nhất
      cho mọi khách hàng. Từ các gói data tốc độ cao, dịch vụ thoại – SMS tiết kiệm,
      cho đến các giải pháp Internet – truyền hình hiện đại.
    </p>
  </div>

  {/* 4 Feature Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-12">

    {/* Gói Data */}
    <div className="group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
      <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-red-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition duration-500"></div>
      <div className="relative">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-2xl flex items-center justify-center">
          <Wifi className="w-10 h-10 text-red-500" strokeWidth={1.4} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Gói Data Tốc Độ Cao</h3>
        <p className="text-gray-600">Lướt web, xem phim, livestream mượt mà với tốc độ 4G/5G ổn định.</p>
      </div>
    </div>

    {/* Thoại + SMS */}
    <div className="group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
      <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-red-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition duration-500"></div>
      <div className="relative">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-2xl flex items-center justify-center">
          <PhoneCall className="w-10 h-10 text-red-500" strokeWidth={1.4} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Gọi & SMS Tiết Kiệm</h3>
        <p className="text-gray-600">Các gói thoại – SMS giá rẻ, phù hợp cho nhu cầu liên lạc hàng ngày.</p>
      </div>
    </div>

    {/* Internet – Truyền hình */}
    <div className="group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
      <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-red-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition duration-500"></div>
      <div className="relative">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-2xl flex items-center justify-center">
          <Tv className="w-10 h-10 text-red-500" strokeWidth={1.4} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Internet – Truyền Hình</h3>
        <p className="text-gray-600">Tốc độ cao, đường truyền ổn định, phù hợp cho gia đình & doanh nghiệp.</p>
      </div>
    </div>

    {/* Giá trị gia tăng */}
    <div className="group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
      <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-red-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition duration-500"></div>
      <div className="relative">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-2xl flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-red-500" strokeWidth={1.4} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Dịch Vụ Giá Trị Gia Tăng</h3>
        <p className="text-gray-600">Nhạc chờ, Cloud, lưu trữ, bảo mật... đáp ứng đa dạng nhu cầu hiện đại.</p>
      </div>
    </div>

  </div>
</div>


      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 30px) scale(1.1); }
          66% { transform: translate(20px, -20px) scale(0.9); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.05); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes shimmer-slow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(12deg); }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 30s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-shimmer-slow {
          animation: shimmer-slow 3s infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out both;
        }

        .slick-dots {
          bottom: 30px !important;
          z-index: 40;
        }

        .slick-dots li {
          margin: 0 6px !important;
        }

        .slick-dots li button:before {
          font-size: 12px !important;
          color: white !important;
          opacity: 0.5 !important;
        }

        .slick-dots li.slick-active button:before {
          opacity: 1 !important;
          color: #ef4444 !important;
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;