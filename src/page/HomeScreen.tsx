import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import { categoryApi, servicePackageApi } from "../api";
import PackageCard from "../components/Package/PackageCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//  Danh sách ảnh banner
const bannerImages = [
  "https://i.pinimg.com/1200x/3e/27/81/3e27812a61e5c3202ee93231fd532190.jpg",
  "https://i.pinimg.com/736x/db/8a/e5/db8ae51f60723fca4fd2218925c859e8.jpg",
  "https://i.pinimg.com/736x/79/de/fe/79defeb2be148dd85f1766df6425fee1.jpg",
];

const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"month" | "day" | "other">(
    "month"
  );
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const sliderRef = useRef<any>(null);

  //  Cấu hình slider
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

  //  Thanh tiến trình chạy đều
  useEffect(() => {
    const t = setInterval(() => setProgress((p) => Math.min(p + 5, 100)), 100);
    return () => clearInterval(t);
  }, [currentSlide]);

  // 🔹 Fetch dữ liệu từ API (hoặc mock nếu USE_MOCK = true)
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
      }
    }
    fetchData();
  }, []);

  //  Lọc gói cước theo tab
  const filterByTab = (pkg: any) => {
    if (activeTab === "month")
      return pkg.duration_months > 0 && pkg.duration_months <= 3;
    if (activeTab === "day") return pkg.duration_months === 0;
    if (activeTab === "other") return pkg.duration_months > 3;
    return true;
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      {/*  BANNER SLIDER */}
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center items-start px-6 sm:px-16 text-white">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-lg">
                  Viettel ra mắt gói cước 5G theo ngày
                </h1>
                <p className="text-base sm:text-lg text-gray-100 drop-shadow">
                  Tốc độ siêu nhanh – Giá siêu rẻ chỉ từ 5.000đ/ngày
                </p>
              </div>
            </div>
          ))}
        </Slider>

        {/*  Thanh tiến trình */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/*  TAB CHỌN LOẠI GÓI */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center mb-10 space-x-6 text-lg font-semibold text-gray-600">
          {[
            { key: "month", label: "Gói Cước Tháng" },
            { key: "day", label: "Gói Cước Ngày" },
            { key: "other", label: "Gói Khác / Combo" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`pb-2 border-b-2 transition-all duration-300 ${
                activeTab === tab.key
                  ? "text-red-600 border-red-600"
                  : "border-transparent hover:text-red-600"
              }`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/*  DANH MỤC HIỂN THỊ THEO TAB */}
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryPackages = packages.filter(
              (pkg) => pkg.category_id === category.id && filterByTab(pkg)
            );

            if (categoryPackages.length === 0) return null;

            return (
              <section key={category.id}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 uppercase">
                    {category.category_name}
                  </h2>
                  <button className="text-red-600 font-medium hover:underline">
                    Xem tất cả →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 justify-items-center">
                  {categoryPackages.map((pkg) => (
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
