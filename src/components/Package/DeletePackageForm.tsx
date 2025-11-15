import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DeletePackageFormProps {
    onClose: () => void;
    onConfirm: () => void;
    name: string;
    isOpen: boolean;
}

const DeletePackageForm: React.FC<DeletePackageFormProps> = ({ isOpen, name, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-200 relative"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Xác nhận xóa</h2>
                        <p className="text-gray-600 mb-6 text-center">
                            Bạn có chắc chắn muốn xóa gói dịch vụ
                            <span className="font-semibold text-red-500"> {name}</span>?<br />
                            Hành động này không thể hoàn tác.
                        </p>

                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Xóa
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DeletePackageForm;
