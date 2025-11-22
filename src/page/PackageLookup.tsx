import { useState } from "react";

export default function TraCuuGoiCuoc() {
    const [fromDate, setFromDate] = useState("2025-09-01");
    const [toDate, setToDate] = useState("2025-11-13");
    const [type, setType] = useState("tax");
    const [focused, setFocused] = useState(null);
    const [hoveredRadio, setHoveredRadio] = useState(null);

    const handleFromDateChange = (value: string) => {
        setFromDate(value);
        if (value > toDate) {
            setToDate(value);
        }
    };

    const handleToDateChange = (value: string) => {
        if (value < fromDate) return;
        setToDate(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 animate-slideDown">
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-3">
                        Hóa đơn điện tử
                    </h2>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full"></div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100 animate-fadeIn">
                    {/* NGÀY */}
                    <div className="grid grid-cols-2 gap-8 mb-10">
                        <div className="animate-slideUp" style={{ animationDelay: "0.1s" }}>
                            <label className="font-bold text-gray-700 block mb-3 text-base uppercase tracking-wider">
                                Từ ngày
                            </label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => handleFromDateChange(e.target.value)}
                                onFocus={() => setFocused("from")}
                                onBlur={() => setFocused(null)}
                                className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-300 focus:outline-none font-medium ${focused === "from"
                                    ? "border-red-600 bg-red-50 shadow-lg ring-4 ring-red-100"
                                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                                    }`}
                            />
                        </div>

                        <div className="animate-slideUp" style={{ animationDelay: "0.15s" }}>
                            <label className="font-bold text-gray-700 block mb-3 text-base uppercase tracking-wider">
                                Đến ngày
                            </label>
                            <input
                                type="date"
                                min={fromDate}
                                value={toDate}
                                onChange={(e) => handleToDateChange(e.target.value)}
                                onFocus={() => setFocused("to")}
                                onBlur={() => setFocused(null)}
                                className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-300 focus:outline-none font-medium ${focused === "to"
                                    ? "border-red-600 bg-red-50 shadow-lg ring-4 ring-red-100"
                                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                                    }`}
                            />
                        </div>
                    </div>

                    {/* RADIO */}
                    <div className="space-y-4 mb-10 animate-slideUp" style={{ animationDelay: "0.2s" }}>
                        <p className="font-bold text-gray-700 text-base uppercase tracking-wider mb-5">
                            Loại tra cứu
                        </p>

                        {[
                            { value: "tax", label: "Tra cứu theo mã số thuế" },
                            { value: "contract", label: "Tra cứu theo hợp đồng" },
                            { value: "personal", label: "Tra cứu theo cá nhân" }
                        ].map((option) => (
                            <label
                                key={option.value}
                                onMouseEnter={() => setHoveredRadio(option.value)}
                                onMouseLeave={() => setHoveredRadio(null)}
                                className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 ${type === option.value
                                    ? "bg-red-50 border-2 border-red-600 shadow-md"
                                    : hoveredRadio === option.value
                                        ? "bg-gray-50 border-2 border-gray-300"
                                        : "bg-white border-2 border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="type"
                                    checked={type === option.value}
                                    onChange={() => setType(option.value)}
                                    className="w-6 h-6 text-red-600 cursor-pointer"
                                />
                                <span className={`font-semibold text-gray-800 transition-colors duration-300 text-lg ${type === option.value ? "text-red-600" : ""
                                    }`}>
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={(e) => e.preventDefault()}
                        className="mt-10 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-xl animate-slideUp"
                        style={{ animationDelay: "0.25s" }}
                    >
                        Tra cứu
                    </button>

                    {/* KẾT QUẢ */}
                    <div className="mt-12 pt-10 border-t-2 border-gray-200 animate-slideUp" style={{ animationDelay: "0.3s" }}>
                        <p className="font-bold text-gray-700 text-base uppercase tracking-wider mb-5">
                            Kết quả tìm kiếm
                        </p>
                        <div className="p-8 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 text-center font-medium bg-gray-50 text-lg">
                            (Chưa có dữ liệu)
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }

                .animate-slideDown {
                    animation: slideDown 0.6s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}