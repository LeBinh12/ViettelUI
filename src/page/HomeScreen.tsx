import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
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
  const sliderRef = useRef<any>(null);

  const bannerSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
    arrows: false,
    beforeChange: () => setProgress(0),
    afterChange: (index: number) => setCurrentSlide(index),
  };

  // Progress animation for banner
  useEffect(() => {
    const timer = setInterval(
      () => setProgress((p) => Math.min(p + 5, 100)),
      100
    );
    return () => clearInterval(timer);
  }, [currentSlide]);

  // Fetch categories khi load trang
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

        // Tự động chọn category đầu tiên
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

  // Fetch packages khi đổi category
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

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
      {[...Array(8)].map((_, j) => (
        <div
          key={j}
          className="w-full h-80 bg-gray-300 animate-pulse rounded-3xl"
        ></div>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      {/* BANNER */}
      <div className="relative w-full h-56 sm:h-64 lg:h-80 mb-10 overflow-hidden rounded-b-2xl">
        <Slider ref={sliderRef} {...bannerSettings}>
          {bannerImages.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={img}
                alt={`Banner ${idx + 1}`}
                className={`w-full h-56 sm:h-64 lg:h-80 object-cover transition-transform duration-[4000ms] ease-out ${
                  currentSlide === idx ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          ))}
        </Slider>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* CATEGORY TABS */}
        <div className="flex justify-center mb-10 space-x-6 text-lg font-semibold text-gray-600 flex-wrap gap-y-4">
          {loading ? (
            <div className="flex space-x-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-32 h-6 bg-gray-200 animate-pulse rounded"
                ></div>
              ))}
            </div>
          ) : (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`pb-2 border-b-2 transition-all duration-300 ${
                  activeTab === category.id
                    ? "text-red-600 border-red-600"
                    : "border-transparent hover:text-red-600"
                }`}
              >
                {category.name}
              </button>
            ))
          )}
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
            <p className="text-red-600 font-medium mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* PACKAGES CONTENT */}
        <div>
          {loadingPackages ? (
            <SkeletonLoader />
          ) : packages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                Không có gói cước nào trong danh mục này
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  id={pkg.id}
                  data={pkg.packageName}
                  price={pkg.price}
                  duration_months={pkg.durationMonths}
                  isDay={pkg.durationMonths === 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
