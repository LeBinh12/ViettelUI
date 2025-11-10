import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import { categoryApi, servicePackageApi } from "../api";
import PackageCard from "../components/Package/PackageCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const bannerImages = [
  "https://i.pinimg.com/1200x/3e/27/81/3e27812a61e5c3202ee93231fd532190.jpg",
  "https://i.pinimg.com/736x/db/8a/e5/db8ae51f60723fca4fd2218925c859e8.jpg",
  "https://i.pinimg.com/736x/79/de/fe/79defeb2be148dd85f1766df6425fee1.jpg",
];

const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"month" | "day" | "other">("month");
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const t = setInterval(() => setProgress((p) => Math.min(p + 5, 100)), 100);
    return () => clearInterval(t);
  }, [currentSlide]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catData, pkgData] = await Promise.all([
          categoryApi.getAll(),
          servicePackageApi.getAll(),
        ]);
        setCategories(catData);
        setPackages(pkgData);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filterByTab = (pkg: any) => {
    if (activeTab === "month")
      return pkg.duration_months > 0 && pkg.duration_months <= 3;
    if (activeTab === "day") return pkg.duration_months === 0;
    if (activeTab === "other") return pkg.duration_months > 3;
    return true;
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-8">

      {/* BANNER */}
      <div className="relative w-full h-56 sm:h-64 lg:h-80 mb-10 overflow-hidden rounded-b-2xl">
        {loading ? (
          <div className="w-full h-full animate-pulse bg-gray-300"></div>
        ) : (
          <Slider ref={sliderRef} {...bannerSettings}>
            {bannerImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  className={`w-full h-56 sm:h-64 lg:h-80 object-cover transition-transform duration-[4000ms] ease-out ${currentSlide === idx ? "scale-105" : "scale-100"
                    }`}
                />
              </div>
            ))}
          </Slider>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4">

        {/* TABS */}
        <div className="flex justify-center mb-10 space-x-6 text-lg font-semibold text-gray-600">
          {loading ? (
            // 🔥 Skeleton Tab
            <div className="flex space-x-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-32 h-6 bg-gray-200 animate-pulse rounded"
                ></div>
              ))}
            </div>
          ) : (
            // ✅ Tab thật khi có data
            ["month", "day", "other"].map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`pb-2 border-b-2 transition-all duration-300 ${activeTab === key
                    ? "text-red-600 border-red-600"
                    : "border-transparent hover:text-red-600"
                  }`}
              >
                {key === "month"
                  ? "Gói Cước Tháng"
                  : key === "day"
                    ? "Gói Cước Ngày"
                    : "Gói Khác / Combo"}
              </button>
            ))
          )}
        </div>


        {/* CONTENT */}
        <div className="space-y-12">
          {loading
            ? (
              // ✅ Skeleton cho danh mục + grid
              [...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="h-6 w-40 bg-gray-300 animate-pulse rounded mb-6"></div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((__, j) => (
                      <div key={j} className="w-full h-40 bg-gray-300 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                </div>
              ))
            )
            : categories.map((category) => {
              const categoryPackages = packages.filter(
                (pkg) => pkg.category_id === category.id && filterByTab(pkg)
              );
              if (categoryPackages.length === 0) return null;

              return (
                <section key={category.id}>
                  <h2 className="text-xl font-bold text-gray-800 uppercase mb-4">
                    {category.category_name}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
                    {categoryPackages.map((pkg) => (
                      <PackageCard key={pkg.id} {...pkg} />
                    ))}
                  </div>
                </section>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
