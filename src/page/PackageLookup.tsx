import { useState, useRef } from "react";
import { invoiceApi } from "../api/invoiceApi";
import { toast } from "react-toastify";

export default function TraCuuGoiCuoc() {
  const [fromDate, setFromDate] = useState("2025-09-01");
  const [toDate, setToDate] = useState("2025-11-13");

  const [type, setType] = useState<"invoice" | "customer">("invoice");

  // STATE CHO FORM
  const [invoiceCode, setInvoiceCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // STATE kết quả tra cứu
  const [invoiceResult, setInvoiceResult] = useState<any>(null);

  // STATE loading
  const [isLoading, setIsLoading] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    setIsLoading(true); // Bắt đầu loading
    if (type === "invoice") {
      if (!invoiceApi.isValidUUID(invoiceCode)) {
        toast.error("Mã hóa đơn định dạng không hợp lệ");
        setIsLoading(false);
        return;
      }

      try {
        const result = await invoiceApi.getById(invoiceCode);
        console.log("Kết quả tra cứu:", result);
        setInvoiceResult(result);
        toast.success("Tra cứu thành công!");

        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (error: any) {
        setInvoiceResult(null);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
          console.error("Lỗi:", error.response.data);
        } else {
          toast.error("Đã có lỗi xảy ra khi tra cứu hóa đơn");
          console.error("Lỗi không xác định:", error);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Tra cứu người dùng
      try {
        const customerData = { email, phone };
        const result = await invoiceApi.requestHistory(customerData);
        console.log("Kết quả requestHistory:", result);

        if (!result.succeeded) {
          toast.error(`Lỗi: ${result.message}`);
          return;
        }

        toast.info("Bạn cần check email để xem lịch sử đơn");
      } catch (error: any) {
        if (error.response?.data?.message) {
          toast.error(`Lỗi: ${error.response.data.message}`);
          console.error("API trả lỗi:", error.response.data);
        } else {
          toast.error("Đã có lỗi xảy ra khi yêu cầu token lịch sử hóa đơn");
          console.error("Lỗi không xác định:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }
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
              <span className="text-lg font-semibold">Tra cứu mã hóa đơn</span>
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
                <strong>Giá:</strong> {invoiceResult.data.invoice.package.price}{" "}
                VND
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
  );
}
