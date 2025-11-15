import React, { useState } from "react";
import type { User } from "../../types/user";

interface Props {
  user: User;
  onClose: () => void;
  onSubmit: (data: Partial<Omit<User, "id">>) => void;
}

const UpdateUserForm: React.FC<Props> = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Omit<User, "id">>>({ ...user });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Cập nhật người dùng</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300" required />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300" />
          <input type="text" name="packageName" value={formData.packageName} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300" />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300" />
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300" />
          </div>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300">
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

export default UpdateUserForm;
