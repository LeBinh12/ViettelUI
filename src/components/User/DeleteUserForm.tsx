import React from "react";

interface Props {
  isOpen: boolean;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteUserForm: React.FC<Props> = ({ isOpen, name, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Xác nhận xóa</h2>
        <p className="text-gray-600 mb-6">
          Bạn có chắc muốn xóa người dùng <span className="font-semibold text-red-500">{name}</span>? Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition">
            Hủy
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition">
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserForm;
