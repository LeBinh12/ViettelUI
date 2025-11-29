// src/components/Category/CategoryForm.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type CategoryFormProps<T> = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  initialData?: T;
  title?: string;
};

const CategoryForm = <
  T extends { name: string; description: string; id?: string }
>({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: CategoryFormProps<T>) => {
  const isEditMode = !!initialData;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  // Reset form khi mở modal hoặc chuyển đổi giữa thêm/sửa
  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initialData?.name || "",
        description: initialData?.description || "",
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const err: any = {};
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      err.name = "Tên danh mục không được để trống";
    } else if (trimmedName.length < 2) {
      err.name = "Tên phải có ít nhất 2 ký tự";
    }

    setErrors(err);
    if (Object.keys(err).length > 0) return;

    if (isEditMode) {
      // Chắc chắn có id khi edit
      onSubmit({
        ...(form as T),
        id: initialData!.id,
      });
    } else {
      onSubmit(form as T);
    }
  };

  if (!isOpen) return null;

  const defaultTitle = isEditMode ? "Cập nhật danh mục" : "Thêm danh mục mới";

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <h2 className="text-2xl font-bold">{title || defaultTitle}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="VD: Gói Premium, Doanh nghiệp..."
              autoFocus
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả (tùy chọn)
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Mô tả về danh mục này..."
            />
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition"
            >
              {isEditMode ? "Cập nhật" : "Thêm danh mục"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CategoryForm;
