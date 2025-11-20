import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Customer } from "../../types/customer";

interface Props {
  customers: Customer[];
  onEdit: (user: Customer) => void;
  onDelete: (id: string) => void;
}

const UserTable: React.FC<Props> = ({ customers, onEdit, onDelete }) => {
  console.log("Customer", customers);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
          <tr>
            <th className="py-3 px-4 text-center font-medium w-16">STT</th>
            <th className="py-3 px-4 text-left font-medium">Họ và Tên</th>
            <th className="py-3 px-4 text-left font-medium">Email</th>
            <th className="py-3 px-4 text-left font-medium">SĐT</th>
            <th className="py-3 px-4 text-left font-medium">Địa chỉ</th>
            <th className="py-2 px-4 text-center font-medium">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {customers.map((u, index) => (
            <tr
              key={u.id}
              className="border-b border-gray-200 hover:bg-indigo-50/40 transition-colors"
            >
              <td className="py-3 px-4 text-center font-semibold text-gray-700">
                {index + 1}
              </td>
              <td className="py-3 px-4">{u.fullName}</td>
              <td className="py-3 px-4">{u.email}</td>
              <td className="py-3 px-4">{u.phone}</td>
              <td className="py-3 px-4">{u.address}</td>

              <td className="py-3 px-4 flex justify-center items-center gap-3">
                <button
                  onClick={() => onEdit(u)}
                  className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition shadow-sm"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete(u.id)}
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

export default UserTable;
