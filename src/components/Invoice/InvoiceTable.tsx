import type { Invoice } from "../../types/invoice";
import React from "react";
import { Eye } from "lucide-react";


interface InvoiceTableProps {
  invoices: Invoice[];
  onView: (id: string) => void;
  isCallback: boolean;
  setIsCallback: (v: boolean) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onView,
  isCallback,
  setIsCallback,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
          <tr>
            <th className="py-3 px-4 text-center font-medium w-16">STT</th>
            <th className="py-3 px-4 text-left font-medium">Tên khách hàng</th>
            <th className="py-3 px-4 text-left font-medium">Số tiền</th>
            <th className="py-3 px-4 text-left font-medium">Ngày lập</th>
            <th className="py-3 px-4 text-left font-medium">Trạng thái</th>
            <th className="py-3 px-4 text-center font-medium">Hành động</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {invoices.map((inv, index) => (
            <tr
              key={inv.id}
              className="border-b border-gray-200 hover:bg-indigo-50/40 transition-colors"
            >
              <td className="py-3 px-4 text-center font-semibold text-gray-700">
                {index + 1}
              </td>

              <td className="py-3 px-4">{inv.customerName}</td>

              <td className="py-3 px-4">{inv.amount.toLocaleString()} đ</td>

              <td className="py-3 px-4">{inv.date}</td>

              <td
                className={`py-3 px-4 font-semibold ${inv.status === "Paid"
                  ? "text-green-600"
                  : inv.status === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                  }`}
              >
                {inv.status}
              </td>

              <td className="py-3 px-4 flex justify-center items-center gap-3">
                <button
                  onClick={() => onView(inv.id)}
                  className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition shadow-sm"
                >
                  <Eye size={18} />
                </button>

                <button
                  disabled={isCallback}
                  onClick={() => setIsCallback(true)}
                  className={`p-2 rounded-lg transition shadow-sm
                    ${isCallback
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-rose-100 text-rose-600 hover:bg-rose-200"
                    }
                  `}
                >
                  CallBack
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
