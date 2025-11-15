import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { User } from "../../types/user";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const UserTable: React.FC<Props> = ({ users, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Tên</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">SĐT</th>
            <th className="py-2 px-4 text-left">Gói dịch vụ</th>
            <th className="py-2 px-4 text-left">Trạng thái</th>
            <th className="py-2 px-4 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="py-2 px-4">{u.id}</td>
              <td className="py-2 px-4">{u.name}</td>
              <td className="py-2 px-4">{u.email}</td>
              <td className="py-2 px-4">{u.phone}</td>
              <td className="py-2 px-4">{u.packageName}</td>
              <td className={`py-2 px-4 font-semibold ${u.status === "Đang hoạt động" ? "text-green-600" : "text-red-600"}`}>
                {u.status}
              </td>
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
