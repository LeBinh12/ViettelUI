import React, { useState } from "react";
import type { User } from "../../types/user";

interface Props {
  onClose: () => void;
  onSubmit: (data: Omit<User, "id">) => void;
}

const AddUserForm: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    phone: "",
    packageName: "",
    startDate: "",
    endDate: "",
    status: "Đang hoạt động",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.packageName) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Thêm người dùng</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" name="name" placeholder="Tên người dùng" value={form.name} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300" required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300" required />
          <input type="text" name="phone" placeholder="Số điện thoại" value={form.phone} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300" />
          <input type="text" name="packageName" placeholder="Gói dịch vụ" value={form.packageName} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300" />
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300" />
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300" />
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300">
            <option>Đang hoạt động</option>
            <option>Hết hạn</option>
          </select>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
