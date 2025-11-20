import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AddCustomerFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email) {
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
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 mx-4"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
            Thêm khách hàng
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Họ và tên
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập email"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Địa chỉ
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Nhập địa chỉ"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition text-gray-800 font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Lưu
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddCustomerForm;
