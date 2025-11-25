import { useState, useMemo } from "react";
import PackageCard from "../components/Package/PackageCard";
import { mockPackages } from "../data/mock/search.mock";
import { BsSearch } from "react-icons/bs";
import { Wifi, PhoneCall, Tv, Sparkles } from "lucide-react";

const SearchPage = () => {
    const [keyword, setKeyword] = useState("");
    const [submittedKeyword, setSubmittedKeyword] = useState("");

    const results = useMemo(() => {
        const q = submittedKeyword.toLowerCase().trim();
        if (!q) return [];

        return mockPackages.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.data.toLowerCase().includes(q)
        );
    }, [submittedKeyword]);

    const handleSearch = () => {
        setSubmittedKeyword(keyword);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="relative bg-white min-h-screen overflow-hidden">
            <h2 className="text-3xl font-bold mb-6 text-center">Tìm kiếm gói cước</h2>
            {/* Input + nút tìm kiếm */}
            <div className="mb-6 flex justify-center gap-3">
                <div className="relative w-full sm:w-2/3 lg:w-1/2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                    >
                        <BsSearch size={22} />
                    </button>
                </div>

            </div>

            {/* --- Dòng kết quả tìm kiếm --- */}
            {submittedKeyword !== "" && (
                <p className="text-xl font-bold text-gray-700 mb-6 text-center">
                    Kết quả tìm kiếm
                    {/* <span className="text-red-600 font-semibold"> "{submittedKeyword}"</span> */}
                </p>
            )}

            {/* Không có kết quả */}
            {submittedKeyword !== "" && results.length === 0 && (
                <p className="text-gray-600 text-center">
                    Không tìm thấy gói cước phù hợp.
                </p>
            )}

            {/* Có kết quả */}
            {submittedKeyword !== "" && results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {results.map((pkg) => (
                        <PackageCard
                            key={pkg.id}
                            id={pkg.id}
                            data={pkg.data}
                            price={pkg.price}
                            duration_months={pkg.duration_months}
                            isDay={pkg.isDay}
                        />
                    ))}
                </div>
            )}
            <div className="mt-32 relative">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-red-600 to-gray-900">
                            Giới Thiệu Dịch Vụ Viettel
                        </span>
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Viettel cung cấp đa dạng dịch vụ viễn thông nhằm mang đến trải
                        nghiệm tốt nhất cho mọi khách hàng. Từ các gói data tốc độ cao,
                        dịch vụ thoại – SMS tiết kiệm, cho đến các giải pháp Internet –
                        truyền hình hiện đại.
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
                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                Gói Data Tốc Độ Cao
                            </h3>
                            <p className="text-gray-600">
                                Lướt web, xem phim, livestream mượt mà với tốc độ 4G/5G ổn
                                định.
                            </p>
                        </div>
                    </div>

                    {/* Thoại + SMS */}
                    <div className="group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                        <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-red-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition duration-500"></div>
                        <div className="relative">
                            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-2xl flex items-center justify-center">
                                <PhoneCall
                                    className="w-10 h-10 text-red-500"
                                    strokeWidth={1.4}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                Gọi & SMS Tiết Kiệm
                            </h3>
                            <p className="text-gray-600">
                                Các gói thoại – SMS giá rẻ, phù hợp cho nhu cầu liên lạc hàng
                                ngày.
                            </p>
                        </div>
                    </div>

                    {/* Internet – Truyền hình */}
                    <div className="group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                        <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-red-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition duration-500"></div>
                        <div className="relative">
                            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-2xl flex items-center justify-center">
                                <Tv className="w-10 h-10 text-red-500" strokeWidth={1.4} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                Internet – Truyền Hình
                            </h3>
                            <p className="text-gray-600">
                                Tốc độ cao, đường truyền ổn định, phù hợp cho gia đình & doanh
                                nghiệp.
                            </p>
                        </div>
                    </div>

                    {/* Giá trị gia tăng */}
                    <div className="group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                        <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-red-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition duration-500"></div>
                        <div className="relative">
                            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-2xl flex items-center justify-center">
                                <Sparkles
                                    className="w-10 h-10 text-red-500"
                                    strokeWidth={1.4}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                Dịch Vụ Giá Trị Gia Tăng
                            </h3>
                            <p className="text-gray-600">
                                Nhạc chờ, Cloud, lưu trữ, bảo mật... đáp ứng đa dạng nhu cầu
                                hiện đại.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
