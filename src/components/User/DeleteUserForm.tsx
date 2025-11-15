import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteUserForm: React.FC<Props> = ({ isOpen, name, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background Blur */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Xác nhận xóa</h2>
            <p className="text-gray-600 mb-6 text-center">
              Bạn có chắc muốn xóa người dùng <span className="font-semibold text-red-500">{name}</span>?<br />
              Hành động này <span className="text-red-500 font-medium">không thể hoàn tác</span>.
            </p>

            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 transition font-medium shadow-sm"
              >
                Hủy
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition font-medium shadow-lg"
              >
                Xóa
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteUserForm;