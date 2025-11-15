import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "../../types/user";

interface Props {
  user: User;
  onClose: () => void;
  onSubmit: (data: Partial<Omit<User, "id">>) => void;
}

const UpdateUserForm: React.FC<Props> = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Omit<User, "id">>>({ ...user });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 mx-4 grid grid-cols-2 gap-6"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="col-span-2 text-2xl font-semibold mb-6 text-center text-gray-900">
            Cập nhật người dùng
          </h2>

          {/* Left column */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-gray-700">Tên người dùng</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên người dùng"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập email"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Gói dịch vụ</label>
              <input
                type="text"
                name="packageName"
                value={formData.packageName || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập gói dịch vụ"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-gray-700">Ngày bắt đầu</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Ngày kết thúc</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Trạng thái</label>
              <select
                name="status"
                value={formData.status || "Đang hoạt động"}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Hết hạn">Hết hạn</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition text-gray-800 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Lưu
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateUserForm;
