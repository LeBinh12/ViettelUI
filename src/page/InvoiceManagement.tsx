import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

interface Invoice {
  id: string;
  customerName: string;
  date: string;
  amount: number;
  status: string;
}

const DUMMY_INVOICES: Invoice[] = [
  { id: "24FODT748T6", customerName: "Nguyễn Hồng Anh", date: "29/07/2025", amount: 210000, status: "Hoạt động" },
  { id: "24FODT748T6", customerName: "Trần Minh Tuấn", date: "22/02/2025", amount: 210000, status: "Hết hạn" },
  { id: "FEDT1176T6", customerName: "Lê Thị Hương", date: "13/12/2023", amount: 210000, status: "Hết hạn" },
  { id: "25XKMT892P1", customerName: "Phạm Văn Long", date: "15/08/2024", amount: 210000, status: "Hoạt động" },
  { id: "23HNPT456Q9", customerName: "Hoàng Thị Mai", date: "10/05/2023", amount: 210000, status: "Hết hạn" },
  { id: "24SGDT321R7", customerName: "Vũ Quốc Bảo", date: "03/11/2024", amount: 210000, status: "Hoạt động" },
];

export default function InvoiceManagement() {
  const [invoices] = useState(DUMMY_INVOICES);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
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
      @keyframes pulse {
        0%, 100% { opacity: 0.1; }
        50% { opacity: 0.2; }
      }
      .animate-slide-up {
        animation: slideUp 0.5s ease-out backwards;
      }
      .animate-fade-in {
        animation: fadeIn 0.4s ease-out;
      }
      .animate-pulse-custom {
        animation: pulse 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const statusColor = (status: string) => {
    if (status === "Hoạt động") return "text-green-600";
    if (status === "Hết hạn") return "text-red-600";
    return "text-gray-500";
  };

  const getEndDate = (startDate: string) => {
    const [day, month, year] = startDate.split('/');
    const start = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const end = new Date(start);
    end.setMonth(end.getMonth() + 6);
    const endDay = end.getDate().toString().padStart(2, '0');
    const endMonth = (end.getMonth() + 1).toString().padStart(2, '0');
    const endYear = end.getFullYear();
    return `${endDay}/${endMonth}/${endYear}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white p-8 shadow-2xl animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-10 animate-pulse-custom"></div>
        <div className="flex items-center gap-5 relative z-10">
          <ChevronLeft className="w-7 h-7 cursor-pointer hover:scale-125 hover:-translate-x-1 transition-all duration-300" />
          <h1 className="text-2xl font-bold tracking-wide">Lịch sử đóng cước trước</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Grid layout - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {invoices.map((inv, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border-2 border-red-100 animate-slide-up hover:scale-[1.02] hover:-translate-y-1 hover:border-red-300"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex justify-between items-start mb-5">
                <div>
                  <div className="text-sm text-gray-500 mb-2 font-medium tracking-wider">{inv.id}</div>
                  <div className="font-bold text-xl text-gray-800">
                    {inv.customerName}
                  </div>
                </div>
                <div className={`font-semibold text-base px-4 py-1.5 rounded-full ${statusColor(inv.status)} ${inv.status === 'Hoạt động' ? 'bg-green-50' : 'bg-red-50'}`}>
                  {inv.status}
                </div>
              </div>

              <div className="bg-red-50 rounded-2xl p-5 mb-4 border border-red-100">
                <div className="text-base text-gray-700 mb-2 font-medium">
                  ⏱️ 6 tháng: {inv.date} - {getEndDate(inv.date)}
                </div>

                {index === 2 && (
                  <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-l-4 border-yellow-500 p-4 rounded-lg mt-3 shadow-sm animate-fade-in">
                    <p className="text-sm text-yellow-900 font-semibold flex items-center gap-2">
                      <span className="text-lg">⚠️</span> Tăng cước tháng 06/2024
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-base py-2 border-b border-red-100">
                  <span className="text-gray-600 font-medium">Cước đóng trước/tháng:</span>
                  <span className="font-bold text-red-600 text-lg">
                    {inv.amount.toLocaleString()} đ
                  </span>
                </div>
                <div className="flex justify-between items-center text-base py-2">
                  <span className="text-gray-700 font-semibold">Tổng cước đóng trước:</span>
                  <span className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                    1.260.000 đ
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-gray-600 text-base py-6 animate-fade-in font-medium">
          📋 Lịch sử đóng cước trước của 3 kỳ đóng trước gần nhất
        </div>
      </div>
    </div>
  );
}
