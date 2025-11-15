import { useState } from "react";

interface UpdatePackageFormProps {
    pkg: any;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const UpdatePackageForm: React.FC<UpdatePackageFormProps> = ({ pkg, onClose, onSubmit }) => {
    const [categories] = useState([
        { id: "1", name: "Danh mục 1" },
        { id: "2", name: "Danh mục 2" },
        { id: "3", name: "Danh mục 3" },
    ]);

    const [formData, setFormData] = useState({
        name: pkg.name || "",
        price: pkg.price || 0,
        durationMonths: pkg.durationMonths || 0,
        description: pkg.description || "",
        category_id: pkg.category_id || "",
        status: pkg.status || "Đang bán",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" || name === "durationMonths" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.category_id) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Cập nhật gói dịch vụ</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Tên gói</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Giá (VNĐ)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                            required
                            min={0}
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Thời gian (tháng)</label>
                        <input
                            type="number"
                            name="durationMonths"
                            value={formData.durationMonths}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                            required
                            min={0}
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Mô tả</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Danh mục</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
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
                        <label className="block font-medium mb-1">Trạng thái</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        >
                            <option value="Đang bán">Đang bán</option>
                            <option value="Ngừng bán">Ngừng bán</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePackageForm;
