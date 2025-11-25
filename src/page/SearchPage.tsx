import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PackageCard from "../components/Package/PackageCard";
import { BsSearch } from "react-icons/bs";
import { Wifi, PhoneCall, Tv, Sparkles } from "lucide-react";
import { servicePackageApi } from "../api/servicePackage.api";
import type { ServicePackageDTO } from "../types/gemini";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<ServicePackageDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy keyword từ URL khi mount
  useEffect(() => {
    const query = searchParams.get("keyword") || "";
    setKeyword(query);
    if (query.trim()) {
      performSearch(query.trim());
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await servicePackageApi.getSearch(query);
      if (response.succeeded && response.data) {
        setResults(response.data);
      } else {
        setResults([]);
        setError(response.message || "Không tìm thấy kết quả");
      }
    } catch (err: any) {
      console.error("Search error:", err);
      setError(err?.message || "Lỗi kết nối máy chủ");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    // Cập nhật URL
    setSearchParams({ keyword: trimmed });
    // performSearch đã được gọi từ useEffect
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const hasSearched = !!searchParams.get("keyword");

  return (
    <div className="relative bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-900">
          Tìm kiếm gói cước
        </h2>

        {/* Thanh tìm kiếm */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Nhập tên gói, tốc độ, giá tiền..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full pl-6 pr-16 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !keyword.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white transition-all shadow-lg"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <BsSearch size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Kết quả */}
        {hasSearched && (
          <div className="mb-10 text-center">
            <p className="text-2xl font-bold text-gray-800">
              Kết quả cho:{" "}
              <span className="text-red-600">
                "{searchParams.get("keyword")}"
              </span>
            </p>
            <p className="text-gray-600 mt-2">
              Tìm thấy <strong>{results.length}</strong> gói cước
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Đang tìm kiếm...</p>
          </div>
        )}

        {/* Lỗi */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        )}

        {/* Không có kết quả */}
        {hasSearched && !loading && results.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              Không tìm thấy gói cước nào phù hợp với từ khóa{" "}
              <strong>"{searchParams.get("keyword")}"</strong>
            </p>
            <p className="text-gray-500 mt-4">
              Gợi ý: Thử tìm bằng từ khóa ngắn hơn hoặc kiểm tra chính tả
            </p>
          </div>
        )}

        {/* Có kết quả */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {results.map((pkg) => (
              <PackageCard
                key={pkg.id}
                id={pkg.id}
                data={pkg.packageName}
                price={pkg.price}
                duration_months={pkg.durationMonths}
              />
            ))}
          </div>
        )}

        {/* Phần giới thiệu dịch vụ (hiển thị khi chưa tìm hoặc có kết quả) */}
        {!hasSearched || results.length > 0 ? (
          <div className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-red-600 to-gray-900">
                  Dịch Vụ Nổi Bật Của VietDev
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Chúng tôi mang đến những giải pháp viễn thông hiện đại, tốc độ
                cao, giá cả hợp lý phù hợp cho mọi nhu cầu cá nhân và doanh
                nghiệp.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                {
                  icon: Wifi,
                  title: "Internet Tốc Độ Cao",
                  desc: "Lướt web, xem phim 4K, chơi game mượt mà không giật lag",
                },
                {
                  icon: PhoneCall,
                  title: "Gọi & Nhắn Tin Miễn Phí",
                  desc: "Gọi nội mạng miễn phí, nhắn tin không giới hạn",
                },
                {
                  icon: Tv,
                  title: "Truyền Hình Số",
                  desc: "Hơn 200 kênh truyền hình chất lượng cao, xem lại dễ dàng",
                },
                {
                  icon: Sparkles,
                  title: "Dịch Vụ Gia Tăng",
                  desc: "Cloud, nhạc chờ, bảo mật, lưu trữ đám mây...",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-3"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-red-700 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-3xl flex items-center justify-center">
                      <item.icon className="w-12 h-12 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;
