import { useState, useRef, useEffect } from "react";
import { invoiceApi } from "../api/invoiceApi";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { customerAtom } from "../recoil/atoms/userAtom";
import {
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  Timer,
  Clipboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TraCuuGoiCuoc() {
  const customer = useRecoilValue(customerAtom);

  // === STATE CHO FORM TRA CỨU CÔNG KHAI (khi chưa đăng nhập) ===
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportInvoiceId, setReportInvoiceId] = useState<string | null>(null);
  const [reportMessage, setReportMessage] = useState<string>("");
  const [isReporting, setIsReporting] = useState(false);
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState("2025-09-01");
  const [toDate, setToDate] = useState("2025-11-13");
  const [type, setType] = useState<"invoice" | "customer">("invoice");
  const [invoiceCode, setInvoiceCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [invoiceResult, setInvoiceResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // === STATE CHO DANH SÁCH HÓA ĐƠN (khi đã đăng nhập) ===
  const [customerInvoices, setCustomerInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingCustomerInvoices, setLoadingCustomerInvoices] = useState(true);

  // Load danh sách hóa đơn khi đã đăng nhập
  useEffect(() => {
    if (customer) {
      const fetchCustomerInvoices = async () => {
        try {
          setLoadingCustomerInvoices(true);
          console.log(customer.id);
          const response = await invoiceApi.invoiceCustomerId(customer.id);
          if (response.succeeded && response.data) {
            setCustomerInvoices(response.data);
            setFilteredInvoices(response.data);
          } else {
            toast.error("Không thể tải danh sách hóa đơn");
          }
        } catch (err) {
          toast.error("Lỗi khi tải hóa đơn của bạn");
          console.error(err);
        } finally {
          setLoadingCustomerInvoices(false);
        }
      };

      fetchCustomerInvoices();
    }
  }, [customer]);

  // Tìm kiếm trong danh sách hóa đơn của customer
  useEffect(() => {
    if (!customer) return;

    if (!searchTerm.trim()) {
      setFilteredInvoices(customerInvoices);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = customerInvoices.filter((item: any) =>
        item.invoice.id.toLowerCase().includes(lower)
      );
      setFilteredInvoices(filtered);
    }
  }, [searchTerm, customerInvoices, customer]);

  // Xử lý tra cứu công khai (khi chưa đăng nhập)
  const handleSearch = async () => {
    if (customer) return; // Không dùng form này khi đã đăng nhập

    setIsLoading(true);
    if (type === "invoice") {
      if (!invoiceApi.isValidUUID(invoiceCode)) {
        toast.error("Mã hóa đơn định dạng không hợp lệ");
        setIsLoading(false);
        return;
      }

      navigate(`/invoice/${invoiceCode}`);
    } else {
      try {
        const customerData = { email, phone };
        const result = await invoiceApi.requestHistory(customerData);
        if (!result.succeeded) {
          toast.error(`Lỗi: ${result.message}`);
          return;
        }
        toast.success("Vui lòng kiểm tra email để nhận link tra cứu lịch sử!");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Yêu cầu thất bại");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Format ngày
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  const getEndDate = (start: string, months: number) => {
    const d = new Date(start);
    d.setMonth(d.getMonth() + months);
    return formatDate(d.toISOString());
  };

  const getStatusText = (status: number) => {
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

  // GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP
  if (customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-3">
              Hóa đơn của bạn
            </h2>
            <p className="text-xl text-gray-600">
              Chào mừng, {customer.fullName}!
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full mt-4"></div>
          </div>

          {/* Ô tìm kiếm */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã hóa đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-gray-200 focus:border-red-500 focus:outline-none text-lg shadow-md"
              />
            </div>
          </div>

          {loadingCustomerInvoices ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto"></div>
              <p className="mt-4 text-xl text-gray-600">Đang tải hóa đơn...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-20">
              <Clipboard className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">
                {searchTerm
                  ? "Không tìm thấy hóa đơn nào"
                  : "Bạn chưa có hóa đơn nào"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInvoices.map((item: any, idx: number) => {
                const inv = item.invoice;
                const pkg = inv.package;

                return (
                  <div
                    onClick={() => navigate(`/invoice/${inv.id}`)}
                    key={inv.id}
                    className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border-2 border-red-100 hover:scale-105 hover:border-red-300"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          {inv.id.substring(0, 12).toUpperCase()}
                        </p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">
                          {pkg.packageName}
                        </h3>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full font-semibold text-sm ${statusColor(
                          inv.status
                        )}`}
                      >
                        {getStatusText(inv.status)}
                      </span>
                    </div>

                    <div className="bg-red-50 rounded-2xl p-5 mb-6 border border-red-200">
                      <p className="flex items-center gap-2 text-gray-700 font-medium">
                        <Timer className="w-5 h-5" />
                        {pkg.durationMonths} tháng: {formatDate(inv.createdAt)}{" "}
                        → {getEndDate(inv.createdAt, pkg.durationMonths)}
                      </p>

                      {item.isBlockchainMatched ? (
                        <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                          <p className="text-green-800 font-bold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Đã xác thực Blockchain
                          </p>
                        </div>
                      ) : inv.blockchainTxHash === "PENDING" ? (
                        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                          <p className="text-yellow-800 font-bold flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Đang chờ xác thực Blockchain
                          </p>
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cước/tháng:</span>
                        <span className="font-bold text-red-600 text-xl">
                          {inv.amount.toLocaleString()} đ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-semibold">
                          Tổng giá trị gói:
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
          )}

          <div className="text-center mt-10 text-gray-600">
            <p className="text-lg">
              Hiển thị <strong>{filteredInvoices.length}</strong> hóa đơn
              {searchTerm && ` / Tìm kiếm: "${searchTerm}"`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // GIAO DIỆN CÔNG KHAI (khi chưa đăng nhập) - giữ nguyên như cũ
  return (
    <>
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
              <div>
                <label className="font-bold text-gray-700 block mb-3 text-base uppercase tracking-wider">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    if (e.target.value > toDate) setToDate(e.target.value);
                  }}
                  className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-300"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-3 text-base uppercase tracking-wider">
                  Đến ngày
                </label>
                <input
                  type="date"
                  min={fromDate}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-300"
                />
              </div>
            </div>

            {/* RADIO */}
            <div className="space-y-4 mb-10">
              <p className="font-bold text-gray-700 text-base uppercase tracking-wider mb-5">
                Loại tra cứu
              </p>

              <label className="flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={type === "invoice"}
                  onChange={() => setType("invoice")}
                />
                <span className="text-lg font-semibold">
                  Tra cứu mã hóa đơn
                </span>
              </label>

              <label className="flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={type === "customer"}
                  onChange={() => setType("customer")}
                />
                <span className="text-lg font-semibold">
                  Tra cứu theo thông tin người dùng
                </span>
              </label>
            </div>

            {/* FORM THEO LOẠI TRA CỨU */}
            <div className="mt-10">
              {type === "invoice" && (
                <div className="space-y-4">
                  <label className="font-bold text-gray-700 text-base uppercase tracking-wider">
                    Mã hóa đơn
                  </label>
                  <input
                    type="text"
                    value={invoiceCode}
                    onChange={(e) => setInvoiceCode(e.target.value)}
                    placeholder="Nhập mã hóa đơn..."
                    className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-300"
                  />
                </div>
              )}

              {type === "customer" && (
                <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-200">
                  <div>
                    <label className="font-bold text-gray-700 text-base uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="VD: email@gmail.com"
                      className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 text-base uppercase tracking-wider">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="VD: 0987654321"
                      className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-300"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSearch}
              disabled={isLoading} // disable khi loading
              className={`mt-10 w-full ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              } text-white font-bold py-5 rounded-2xl text-xl`}
            >
              {isLoading ? "Đang xử lý..." : "Tra cứu"}
            </button>

            {/* KẾT QUẢ */}
            {invoiceResult && (
              <div
                ref={resultRef}
                className="mt-8 p-6 border-2 border-gray-300 rounded-2xl bg-gray-50 cursor-pointer"
                onClick={() => console.log("Invoice detail:", invoiceResult)}
              >
                <p>
                  <strong>Mã hóa đơn:</strong> {invoiceResult.data.invoice.id}
                </p>
                <p>
                  <strong>Khách hàng:</strong>{" "}
                  {invoiceResult.data.invoice.customer.fullName}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {invoiceResult.data.invoice.customer.email}
                </p>
                <p>
                  <strong>Số điện thoại:</strong>{" "}
                  {invoiceResult.data.invoice.customer.phone}
                </p>
                <p>
                  <strong>Gói dịch vụ:</strong>{" "}
                  {invoiceResult.data.invoice.package.packageName}
                </p>
                <p>
                  <strong>Giá:</strong>{" "}
                  {invoiceResult.data.invoice.package.price} VND
                </p>
                <p>
                  <strong>Ngày hết hạn:</strong>{" "}
                  {new Date(
                    invoiceResult.data.invoice.dueDate
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Trạng thái Blockchain:</strong>{" "}
                  {invoiceResult.data.isBlockchainMatched ? "Đúng" : "Sai"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showReportModal && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          {/* Layer mờ nền form chính */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-3xl"></div>

          {/* Modal thật sự */}
          <div className="relative bg-white rounded-3xl p-8 w-96 shadow-lg text-center z-10">
            <p className="mb-6 text-gray-800">{reportMessage}</p>
            <div className="flex justify-between gap-4">
              <button
                className="flex-1 bg-red-600 text-white py-3 rounded-2xl hover:bg-red-700"
                onClick={async () => {
                  if (!reportInvoiceId) return;
                  setIsReporting(true);
                  try {
                    const res = await invoiceApi.reportForAdmin(
                      reportInvoiceId
                    );
                    if (res.succeeded) {
                      toast.success("Đã báo cáo thành công cho Admin!");
                    } else {
                      toast.error(`Báo cáo thất bại: ${res.message}`);
                    }
                  } catch (err) {
                    toast.error("Lỗi khi gửi báo cáo");
                  } finally {
                    setIsReporting(false);
                    setShowReportModal(false);
                  }
                }}
                disabled={isReporting}
              >
                {isReporting ? "Đang gửi..." : "Xác nhận"}
              </button>
              <button
                className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-2xl hover:bg-gray-400"
                onClick={() => setShowReportModal(false)}
                disabled={isReporting}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
