import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AddPackageFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddPackageForm: React.FC<AddPackageFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    durationMonths: "",
    description: "",
    category_id: "",
    status: "Đang bán",
  });

  const [categories] = useState([
    { id: "1", name: "Danh mục 1" },
    { id: "2", name: "Danh mục 2" },
    { id: "3", name: "Danh mục 3" },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = Number(formData.price);
    const durationNum = Number(formData.durationMonths);

    if (
      !formData.name ||
      !formData.category_id ||
      formData.price === "" ||
      formData.durationMonths === "" ||
      priceNum <= 0 ||
      durationNum <= 0
    ) {
      alert("Vui lòng nhập đầy đủ và hợp lệ thông tin!");
      return;
    }

    onSubmit({
      ...formData,
      price: priceNum,
      durationMonths: durationNum,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 mx-4 grid grid-cols-2 gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="col-span-2 text-2xl font-semibold text-center mb-6 text-gray-900">
            Thêm gói dịch vụ
          </h2>

          {/* Cột bên trái */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-gray-700">Tên gói</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên gói dịch vụ"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Giá (VNĐ)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập giá"
                min={0}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Thời gian (tháng)</label>
              <input
                type="number"
                name="durationMonths"
                value={formData.durationMonths}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập thời gian sử dụng (tháng)"
                min={0}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Danh mục</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Đang bán">Đang bán</option>
                <option value="Ngừng bán">Ngừng bán</option>
              </select>
            </div>
          </div>

          {/* Cột bên phải mô tả */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1 text-gray-700">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full h-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Nhập mô tả gói dịch vụ"
              rows={12}
            />
          </div>

          {/* Nút lưu hủy nằm dưới 2 cột */}
          <div className="col-span-2 flex justify-end gap-4 mt-8">
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
              onClick={handleSubmit}
            >
              Lưu
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddPackageForm;
