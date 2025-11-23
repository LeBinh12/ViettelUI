import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CategoryDTO } from "../../types/category";
import { categoryApi } from "../../api";
import { X } from "lucide-react";

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
  const [errors, setErrors] = useState<any>({});

  // ⭐ KHÔNG đổi tên field, giữ đúng cấu trúc Add
  const [formData, setFormData] = useState({
    name: pkg.packageName || "",
    price: pkg.price?.toString() || "",
    durationMonths: pkg.durationMonths?.toString() || "",
    description: pkg.description || "",
    category_id: pkg.category_id || pkg.categoryId || "", // ⭐ tự lấy lại danh mục không phải chọn lại
    status: pkg.status || "Đang bán",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAllCategory();
        if (res.succeeded) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  // ⭐ giữ nguyên validate như Add
  const validateForm = () => {
    const newErrors: any = {};
    const name = formData.name.trim();
    const priceNum = Number(formData.price);
    const durationNum = Number(formData.durationMonths);

    if (!name) newErrors.name = "Tên gói không được để trống";
    else if (name.length < 3)
      newErrors.name = "Tên gói phải có ít nhất 3 ký tự";

    if (!formData.price) newErrors.price = "Giá không được để trống";
    else if (priceNum <= 0) newErrors.price = "Giá phải lớn hơn 0";

    if (!formData.durationMonths)
      newErrors.durationMonths = "Thời gian không được để trống";
    else if (durationNum <= 0)
      newErrors.durationMonths = "Thời gian phải lớn hơn 0";

    if (!formData.category_id)
      newErrors.category_id = "Vui lòng chọn danh mục";

    if (formData.description && formData.description.length < 10)
      newErrors.description = "Mô tả phải có ít nhất 10 ký tự";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "price" || name === "durationMonths") {
      if (!/^[0-9]*$/.test(value)) {
        setErrors((prev: any) => ({
          ...prev,
          [name]: "Chỉ cho phép nhập số",
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      id: pkg.id,
      packageName: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      durationMonths: Number(formData.durationMonths),
      categoryId: formData.category_id,
      status: formData.status,
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
          className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="flex items-center justify-center py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-indigo-500 relative">
            <h2 className="text-xl font-semibold text-white">
              Cập nhật gói dịch vụ
            </h2>

            <button
              onClick={onClose}
              className="absolute right-4 top-3 p-2 hover:bg-gray-200 rounded-full transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 grid grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
              <div className="space-y-4">
                {/* NAME */}
                <div>
                  <label className="block font-medium mb-1 text-gray-700">
                    Tên gói
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-xl p-2.5`}
                    placeholder="Nhập tên gói dịch vụ"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* PRICE */}
                <div>
                  <label className="block font-medium mb-1 text-gray-700">
                    Giá (VNĐ)
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    } rounded-xl p-2.5`}
                    placeholder="Nhập giá"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                {/* DURATION */}
                <div>
                  <label className="block font-medium mb-1 text-gray-700">
                    Thời gian (tháng)
                  </label>
                  <input
                    type="text"
                    name="durationMonths"
                    value={formData.durationMonths}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.durationMonths
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-xl p-2.5`}
                    placeholder="Nhập thời gian"
                  />
                  {errors.durationMonths && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.durationMonths}
                    </p>
                  )}
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="block font-medium mb-1 text-gray-700">
                    Danh mục
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.category_id
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-xl p-2.5`}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category_id}
                    </p>
                  )}
                </div>

                {/* STATUS */}
                <div>
                  <label className="block font-medium mb-1 text-gray-700">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-2.5"
                  >
                    <option value="Đang bán">Đang bán</option>
                    <option value="Ngừng bán">Ngừng bán</option>
                  </select>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="flex flex-col">
                <label className="block font-medium mb-1 text-gray-700">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full h-full border border-gray-300 rounded-xl p-3 resize-none"
                  rows={12}
                  placeholder="Nhập mô tả gói dịch vụ"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-4 px-6 py-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
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
