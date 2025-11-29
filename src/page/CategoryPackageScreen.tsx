import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import type {
  AddCategoryRequest,
  CategoryDTO,
  UpdateCategoryRequest,
} from "../types/category";
import { categoryApi } from "../api/category.api";
import { toast } from "react-toastify";
import CategoryTable from "../components/Category/CategoryTable";
import CategoryForm from "../components/Category/CategoryForm";
import DeleteCategoryModal from "../components/Category/DeleteCategoryForm";

const CategoryScreen: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [updateCategory, setUpdateCategory] = useState<CategoryDTO | null>(
    null
  );

  const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await categoryApi.getAllCategory();
        if (res.succeeded) {
          setCategories(res.data);
        } else {
          toast.error(res.message || "Không thể tải danh sách danh mục");
        }
      } catch (err) {
        toast.error("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Thêm
  const handleAdd = async (data: AddCategoryRequest) => {
    try {
      const res = await categoryApi.add(data);
      if (res.succeeded && res.data) {
        setCategories((prev) => [...prev, res.data]);
        toast.success("Thêm danh mục thành công!");
        setShowAddForm(false);
      } else {
        toast.error(res.message || "Thêm thất bại");
      }
    } catch {
      toast.error("Thêm danh mục thất bại");
    }
  };

  // Sửa
  const handleEdit = (cat: CategoryDTO) => {
    setUpdateCategory(cat);
  };

  const handleUpdate = async (data: UpdateCategoryRequest) => {
    try {
      const res = await categoryApi.update(data);
      if (res.succeeded && res.data) {
        setCategories((prev) =>
          prev.map((c) => (c.id === res.data.id ? res.data : c))
        );
        toast.success("Cập nhật danh mục thành công!");
        setUpdateCategory(null);
      } else {
        toast.error(res.message || "Cập nhật thất bại");
      }
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  // Xóa
  const handleDeleteClick = (cat: CategoryDTO) => {
    setSelectedCategory(cat);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setDeleting(true);
    try {
      const res = await categoryApi.delete(selectedCategory.id);

      if (!res.data) {
        toast.error(`Lỗi: ${res.message}`);
      }
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
      toast.success("Xóa danh mục thành công!");
      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Quản lý danh mục</h2>
          <p className="text-gray-600 mt-1">
            Tổng cộng: {categories.length} danh mục
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:shadow-xl transition"
        >
          <Plus size={20} />
          Thêm danh mục
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh mục...</p>
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Form thêm */}
      <CategoryForm<AddCategoryRequest>
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAdd}
      />

      {/* Form sửa */}
      {updateCategory && (
        <CategoryForm<UpdateCategoryRequest>
          isOpen={!!updateCategory}
          onClose={() => setUpdateCategory(null)}
          onSubmit={handleUpdate}
          initialData={updateCategory}
          title="Cập nhật danh mục"
        />
      )}

      {/* Modal xóa */}
      <DeleteCategoryModal
        isOpen={showDeleteModal}
        name={selectedCategory?.name ?? ""}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default CategoryScreen;
