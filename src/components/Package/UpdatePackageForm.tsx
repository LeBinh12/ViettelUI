import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CategoryDTO } from "../../types/category";
import { categoryApi } from "../../api";

interface UpdatePackageFormProps {
  pkg: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const UpdatePackageForm: React.FC<UpdatePackageFormProps> = ({
  pkg,
  onClose,
  onSubmit,
}) => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  const [formData, setFormData] = useState({
    packageName: pkg.packageName || "",
    price: pkg.price?.toString() || "",
    durationMonths: pkg.durationMonths?.toString() || "",
    description: pkg.description || "",
    categoryId: pkg.categoryId || "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAllCategory();
        if (res.succeeded) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const priceNum = Number(formData.price);
    const durationNum = Number(formData.durationMonths);

    if (
      !formData.packageName.trim() ||
      !formData.categoryId ||
      formData.price.trim() === "" ||
      formData.durationMonths.trim() === "" ||
      priceNum <= 0 ||
      durationNum <= 0
    ) {
      alert("Vui lòng nhập đầy đủ và hợp lệ thông tin!");
      return;
    }

    onSubmit({
      id: pkg.id,
      packageName: formData.packageName,
      price: Number(formData.price),
      description: formData.description,
      durationMonths: Number(formData.durationMonths),
      categoryId: formData.categoryId,
    });

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
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 mx-4"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
            Cập nhật gói dịch vụ
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Tên gói
                </label>
                <input
                  type="text"
                  name="packageName"
                  value={formData.packageName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Giá (VNĐ)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={0}
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Thời gian (tháng)
                </label>
                <input
                  type="number"
                  name="durationMonths"
                  value={formData.durationMonths}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={0}
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Danh mục
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
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
            </div>

            {/* Right column */}
            <div className="flex flex-col">
              <label className="block font-medium mb-1 text-gray-700">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Nhập mô tả gói dịch vụ"
                rows={14}
              />
            </div>

            {/* Buttons below both columns */}
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

export default UpdatePackageForm;
