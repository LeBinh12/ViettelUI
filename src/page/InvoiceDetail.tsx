import React, { useEffect, useState } from "react";
import {
  FileText,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Package,
  DollarSign,
} from "lucide-react";

import { invoiceDetailApi } from "../api/invoiceDetailApi";
import type { InvoiceDetail } from "../data/mock/invoiceDetail";

const InvoiceDetailPage: React.FC = () => {
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await invoiceDetailApi.getInvoiceDetail("INV001");
      if (res.succeeded) {
        setInvoice(res.data);
      }
      setLoading(false);
    };
    fetchDetail();
  }, []);

  
  const getStatusText = (status: string): string => {
    switch (status) {
      case "Pending":
        return "Chờ xử lý";
      case "Paid":
        return "Hoạt động";
      case "Cancelled":
        return "Hết hạn";
      default:
        return "Không xác định";
    }
  };

  const statusColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-300";
      case "Paid":
        return "text-green-600 bg-green-50 border-green-300";
      case "Cancelled":
        return "text-red-600 bg-red-50 border-red-300";
      default:
        return "text-gray-500 bg-gray-50 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 border-t-4 border-red-600">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  Chi tiết Hóa đơn
                </h1>
                <p className="text-red-100 mt-2">Mã hóa đơn: {invoice.id}</p>
              </div>

              <div
                className={`px-6 py-3 rounded-full border-2 ${statusColor(
                  invoice.status
                )} bg-white`}
              >
                <span className="font-semibold text-lg">
                  {getStatusText(invoice.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Package Info */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-[#F2DADA]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-100">
              <div className="bg-red-100 p-3 rounded-xl shadow">
                <Package className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Thông tin gói</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 p-3 rounded-lg shadow-inner">
                <p className="text-sm text-gray-500 mb-1">Tên gói</p>
                <p className="text-lg font-semibold text-gray-800">
                  {invoice.package.name}
                </p>
              </div>

              <div className="bg-red-50 p-3 rounded-lg shadow-inner">
                <p className="text-sm text-gray-500 mb-1">Mô tả</p>
                <p className="text-gray-700">{invoice.package.description}</p>
              </div>

              <div className="flex items-center gap-2 bg-red-50 p-3 rounded-lg shadow-inner">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="text-gray-700">
                  Thời hạn:{" "}
                  <span className="font-semibold text-red-600">
                    {invoice.package.durationMonths} tháng
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg shadow-inner">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">
                  Giá:{" "}
                  <span className="font-semibold text-green-600">
                    {invoice.amount.toLocaleString()}đ
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-[#F2DADA]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-100">
              <div className="bg-red-100 p-3 rounded-xl shadow">
                <User className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Thông tin khách hàng
              </h2>
            </div>

            <div className="space-y-4">

              <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg shadow-inner">
                <User className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Họ tên</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {invoice.user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg shadow-inner">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-700">{invoice.user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg shadow-inner">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="text-gray-700">{invoice.user.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg shadow-inner">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Ngày thanh toán</p>
                  <p className="text-gray-700">{invoice.date}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="mt-6 bg-white rounded-3xl shadow-lg p-6 border border-[#f2f2f2]">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-8 py-3 bg-white text-red-600 border-2 border-red-600 rounded-xl font-semibold hover:bg-red-50 hover:scale-105 transition-all"
            >
              <FileText className="w-5 h-5" />
              In hóa đơn
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceDetailPage;
