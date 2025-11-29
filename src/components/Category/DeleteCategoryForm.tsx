import React from "react";

type DeleteCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
  loading?: boolean;
};

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  name,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()} // Ngăn đóng modal khi click bên trong
      >
        <h3 className="text-xl font-semibold text-gray-800">Xóa danh mục</h3>
        <p className="mt-4 text-gray-600">
          Bạn có chắc muốn xóa danh mục <b>{name}</b>?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Hủy
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
