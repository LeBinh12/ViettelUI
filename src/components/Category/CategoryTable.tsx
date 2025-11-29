// src/components/Category/CategoryTable.tsx
import { Pencil, Trash2 } from "lucide-react";
import type { CategoryDTO } from "../../types/category";

interface Props {
  categories: CategoryDTO[];
  onEdit: (cat: CategoryDTO) => void;
  onDelete: (cat: CategoryDTO) => void;
}

const CategoryTable: React.FC<Props> = ({ categories, onEdit, onDelete }) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl">
        <div className="text-6xl text-gray-300 mb-4">Folder</div>
        <p className="text-gray-500 text-lg">Chưa có danh mục nào</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <tr>
            <th className="py-4 px-6 text-left font-semibold">STT</th>
            <th className="py-4 px-6 text-left font-semibold">Tên danh mục</th>
            <th className="py-4 px-6 text-left font-semibold">Mô tả</th>
            <th className="py-4 px-6 text-center font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, idx) => (
            <tr
              key={cat.id}
              className="border-b border-gray-100 hover:bg-purple-50/50 transition"
            >
              <td className="py-4 px-6 font-medium text-gray-700">{idx + 1}</td>
              <td className="py-4 px-6 font-semibold text-gray-800">
                {cat.name}
              </td>
              <td className="py-4 px-6 text-gray-600 max-w-md truncate">
                {cat.description || (
                  <span className="text-gray-400">Không có mô tả</span>
                )}
              </td>
              <td className="py-4 px-6">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(cat)}
                    className="p-2.5 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(cat)}
                    className="p-2.5 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
