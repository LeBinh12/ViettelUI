import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Clipboard,
  Clock,
  Timer,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { invoiceApi } from "../api/invoiceApi";
import type { InvoiceData } from "../types/payment";
import { useRecoilValue } from "recoil";
import { customerAtom } from "../recoil/atoms/userAtom";

export default function InvoiceManagement() {
  const customer = useRecoilValue(customerAtom);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(location.search);
      const tokenFromUrl = params.get("token");
      setToken(tokenFromUrl);

      if (tokenFromUrl) {
        try {
          setLoading(true);
          const response = await invoiceApi.response(tokenFromUrl);
          console.log("Dữ liệu trả về từ API:", response);

          if (response.succeeded && response.data) {
            setInvoices(response.data);
          } else {
            setError("Không thể tải dữ liệu hóa đơn");
          }
        } catch (err) {
          console.error("Lỗi khi lấy dữ liệu:", err);
          setError("Đã xảy ra lỗi khi tải dữ liệu");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Không tìm thấy token");
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  const getStatusText = (status: number): string => {
    switch (status) {
      case 0:
        return "Chờ xử lý";
      case 1:
        return "Hoạt động";
      case 2:
        return "Hết hạn";
      default:
        return "Không xác định";
    }
  };

  const statusColor = (status: number) => {
    switch (status) {
      case 0:
        return "text-yellow-600 bg-yellow-50";
      case 1:
        return "text-green-600 bg-green-50";
      case 2:
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getEndDate = (
    startDateString: string,
    durationMonths: number
  ): string => {
    const start = new Date(startDateString);
    const end = new Date(start);
    end.setMonth(end.getMonth() + durationMonths);
    const endDay = end.getDate().toString().padStart(2, "0");
    const endMonth = (end.getMonth() + 1).toString().padStart(2, "0");
    const endYear = end.getFullYear();
    return `${endDay}/${endMonth}/${endYear}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md">
          <div className="text-5xl mb-4">
            {" "}
            <AlertCircle className="w-16 h-16" />
          </div>
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white p-8 shadow-2xl animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-10 animate-pulse-custom"></div>
        <div className="flex items-center gap-5 relative z-10">
          <ChevronLeft className="w-7 h-7 cursor-pointer hover:scale-125 hover:-translate-x-1 transition-all duration-300" />
          <h1 className="text-2xl font-bold tracking-wide">
            Lịch sử đóng cước trước
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {invoices.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">
              {" "}
              <Clipboard className="w-16 h-16" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              Chưa có lịch sử hóa đơn
            </p>
          </div>
        ) : (
          <>
            {/* Grid layout - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {invoices.map((invoiceData, index) => {
                const inv = invoiceData.invoice;
                const pkg = inv.package;

                return (
                  <div
                    key={inv.id}
                    className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border-2 border-red-100 animate-slide-up hover:scale-[1.02] hover:-translate-y-1 hover:border-red-300"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <div className="text-sm text-gray-500 mb-2 font-medium tracking-wider">
                          {inv.id.substring(0, 12).toUpperCase()}
                        </div>
                        <div className="font-bold text-xl text-gray-800">
                          {pkg.packageName}
                        </div>
                      </div>
                      <div
                        className={`font-semibold text-base px-4 py-1.5 rounded-full ${statusColor(
                          inv.status
                        )}`}
                      >
                        {getStatusText(inv.status)}
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-2xl p-5 mb-4 border border-red-100">
                      <div className="text-base text-gray-700 mb-2 font-medium">
                        <Timer className="w-5 h-5" /> {pkg.durationMonths}
                        tháng: {formatDate(inv.createdAt)} -
                        {getEndDate(inv.createdAt, pkg.durationMonths)}
                      </div>

                      {/* Blockchain verification badge */}
                      {invoiceData.isBlockchainMatched && (
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-500 p-4 rounded-lg mt-3 shadow-sm animate-fade-in">
                          <p className="text-sm text-green-900 font-semibold flex items-center gap-2">
                            <span className="text-lg">
                              <CheckCircle className="w-5 h-5" />
                            </span>{" "}
                            Đã xác thực Blockchain
                          </p>
                        </div>
                      )}

                      {/* Pending transaction */}
                      {inv.blockchainTxHash === "PENDING" && (
                        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-l-4 border-yellow-500 p-4 rounded-lg mt-3 shadow-sm animate-fade-in">
                          <p className="text-sm text-yellow-900 font-semibold flex items-center gap-2">
                            <span className="text-lg">
                              <Clock className="w-5 h-5" />
                            </span>{" "}
                            Đang chờ xác thực Blockchain
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {/* Cước đóng trước/tháng: số tiền người dùng đóng */}
                      <div className="flex justify-between items-center text-base py-2 border-b border-red-100">
                        <span className="text-gray-600 font-medium">
                          Cước đóng trước/tháng:
                        </span>
                        <span className="font-bold text-red-600 text-lg">
                          {inv.amount.toLocaleString()} đ
                        </span>
                      </div>

                      {/* Tổng cước đóng trước: tổng giá trị gói hiện tại */}
                      <div className="flex justify-between items-center text-base py-2">
                        <span className="text-gray-700 font-semibold">
                          Giá trị gói cước hiện tại:
                        </span>
                        <span className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                          {(pkg.price || 0).toLocaleString()} đ
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center text-gray-600 text-base py-6 animate-fade-in font-medium flex items-center justify-center gap-2">
              <Clipboard className="w-5 h-5" />
              <span>Hiển thị {invoices.length} hóa đơn</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
