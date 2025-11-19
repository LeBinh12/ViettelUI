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
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="py-2 px-4 text-center">Họ và Tên</th>
            <th className="py-2 px-4 text-center">Email</th>
            <th className="py-2 px-4 text-center">SĐT</th>
            <th className="py-2 px-4 text-center">Địa chỉ</th>
            <th className="py-2 px-4 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((u) => (
            <tr
              key={u.id}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              <td className="py-2 px-4">{u.fullName}</td>
              <td className="py-2 px-4">{u.email}</td>
              <td className="py-2 px-4">{u.phone}</td>
              <td className="py-2 px-4">{u.address}</td>

              <td className="py-2 px-4 flex justify-center gap-3">
                <button
                  onClick={() => onEdit(u)}
                  className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete(u.id)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
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
