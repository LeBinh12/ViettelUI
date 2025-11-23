import { Pencil, Trash2 } from "lucide-react";
import type { Invoice } from "../../types/invoice";

interface InvoiceTableProps {
  invoices: Invoice[];
  onEdit: (inv: Invoice) => void;
  onDelete: (id: string) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onEdit,
  onDelete,
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
                className={`py-3 px-4 font-semibold ${
                  inv.status === "Paid"
                    ? "text-green-600"
                    : inv.status === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {inv.status}
              </td>

              <td className="py-3 px-4 flex justify-center items-center gap-3">
                {/* Edit */}
                <button
                  onClick={() => onEdit(inv)}
                  className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition shadow-sm"
                >
                  <Pencil size={18} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDelete(inv.id)}
                  className="p-2 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 transition shadow-sm"
                >
                  <Trash2 size={18} />
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
