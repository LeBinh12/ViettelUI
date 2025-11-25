import React, { useEffect, useState } from "react";
import {
  FileText,
  User,
  Mail,
  Phone,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { invoiceApi } from "../api/invoiceApi";
import { toast } from "react-toastify";
import type { InvoiceData } from "../types/payment";

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return toast.error("Không có mã hóa đơn");

      try {
        setLoading(true);
        const res = await invoiceApi.getById(id);
        if (res.succeeded && res.data) {
          setInvoice(res.data);
          setHasReported(res.data.invoice.isReported || false);

          // TỰ ĐỘNG HIỆN MODAL nếu có sai lệch và chưa báo cáo
          if (res.data.invoice.isTampered && !res.data.invoice.isReported) {
            setShowReportModal(true);
          }
        } else {
          toast.error(res.message || "Không tìm thấy hóa đơn");
        }
      } catch (err) {
        toast.error("Lỗi tải hóa đơn");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleReport = async () => {
    if (!id || reporting || hasReported) return;

    setReporting(true);
    try {
      const res = await invoiceApi.reportForAdmin(id);
      if (res.succeeded) {
        toast.success("Đã gửi báo cáo thành công!");
        setHasReported(true);
        setShowReportModal(false);
      } else {
        toast.error(res.message || "Gửi báo cáo thất bại");
      }
    } catch {
      toast.error("Lỗi khi gửi báo cáo");
    } finally {
      setReporting(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("vi-VN");

  const getStatus = (s: number) => {
    switch (s) {
      case 0:
        return { text: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" };
      case 1:
        return { text: "Hoạt động", color: "bg-green-100 text-green-800" };
      case 2:
        return { text: "Hết hạn", color: "bg-red-100 text-red-800" };
      default:
        return { text: "Không xác định", color: "bg-gray-100 text-gray-800" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-sm">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-bold text-gray-800">
            Không tìm thấy hóa đơn
          </p>
        </div>
      </div>
    );
  }

  const inv = invoice.invoice;
  const status = getStatus(inv.status);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 py-6 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-red-600">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-3">
                    <FileText className="w-8 h-8" />
                    Hóa đơn #{inv.id.slice(0, 12).toUpperCase()}
                  </h1>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <span
                    className={`px-4 py-2 rounded-full font-semibold text-sm ${status.color}`}
                  >
                    {status.text}
                  </span>

                  {inv.isTampered ? (
                    inv.isReported ? (
                      <span className="px-4 py-2 rounded-full bg-orange-100 text-orange-800 font-semibold text-sm flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Đã báo cáo sai
                        lệch
                      </span>
                    ) : (
                      <span className="px-4 py-2 rounded-full bg-red-100 text-red-800 font-semibold text-sm flex items-center gap-2 animate-pulse">
                        <AlertTriangle className="w-5 h-5" /> Phát hiện sai lệch
                      </span>
                    )
                  ) : invoice.isBlockchainMatched ? (
                    <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold text-sm flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Đã xác thực Blockchain
                    </span>
                  ) : (
                    <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-sm flex items-center gap-2">
                      <Clock className="w-5 h-5" /> Chưa xác thực
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Nội dung hóa đơn */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gói cước */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                <Package className="w-6 h-6 text-red-600" /> Gói cước
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Tên gói</p>
                  <p className="text-lg font-bold text-gray-900">
                    {inv.package.packageName}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-bold text-xl">
                      {inv.package.durationMonths} tháng
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-xl">
                      {inv.package.price.toLocaleString()}đ
                    </p>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border-2 border-dashed border-red-300">
                  <p className="text-sm text-gray-600">Cước đóng trước/tháng</p>
                  <p className="text-2xl font-extrabold text-red-600">
                    {inv.amount.toLocaleString()}đ
                  </p>
                </div>
              </div>
            </div>

            {/* Khách hàng */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                <User className="w-6 h-6 text-red-600" /> Khách hàng
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Họ tên</p>
                    <p className="font-semibold">{inv.customer.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-blue-600">
                      {inv.customer.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium text-green-600">
                      {inv.customer.phone}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Ngày tạo</p>
                    <p className="font-medium">{formatDate(inv.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Hết hạn</p>
                    <p className="font-medium text-orange-600">
                      {formatDate(inv.dueDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-xl hover:shadow-xl transition-all"
              >
                <FileText className="w-6 h-6" /> In hóa đơn
              </button>

              {/* Chỉ hiện nút khi có sai lệch và chưa báo cáo */}
              {inv.isTampered && !inv.isReported && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:shadow-xl transition-all animate-pulse"
                >
                  <AlertTriangle className="w-6 h-6" /> Báo cáo sai lệch
                </button>
              )}

              {/* Đã báo cáo */}
              {inv.isTampered && inv.isReported && (
                <div className="flex items-center justify-center gap-3 px-8 py-4 bg-green-100 text-green-800 font-bold rounded-xl shadow-md">
                  <CheckCircle className="w-6 h-6" /> Đã gửi báo cáo cho quản
                  trị
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal báo cáo – blur nền đẹp */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-white/70 backdrop-blur-sm"
            onClick={() => setShowReportModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">
                Phát hiện sai lệch!
              </h3>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Hóa đơn <strong>{inv.id.slice(0, 12).toUpperCase()}</strong> có
                dấu hiệu bị can thiệp.
                <br />
                Bạn có muốn gửi báo cáo cho quản trị viên không?
              </p>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleReport}
                disabled={reporting}
                className="flex-1 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-70 transition-all shadow-lg"
              >
                {reporting ? "Đang gửi..." : "Gửi báo cáo"}
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-4 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-all"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceDetailPage;
