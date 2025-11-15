import { Pencil, Trash2 } from "lucide-react";

interface ServicePackage {
    id: string;
    name: string;
    category_name: string;
    price: number;
    status: string;
}

interface ServicePackageTableProps {
    packages: ServicePackage[];
    onEdit: (pkg: ServicePackage) => void;
    onDelete: (id: string) => void;
}

const ServicePackageTable: React.FC<ServicePackageTableProps> = ({ packages, onEdit, onDelete }) => {
    return (
        < div className="overflow-x-auto" >
            <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
                <thead className="bg-blue-800 text-white">
                    <tr>
                        <th className="py-2 px-4 text-left">ID</th>
                        <th className="py-2 px-4 text-left">Tên sản phẩm</th>
                        <th className="py-2 px-4 text-left">Danh mục</th>
                        <th className="py-2 px-4 text-left">Giá</th>
                        <th className="py-2 px-4 text-left">Trạng thái</th>
                        <th className="py-2 px-4 text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {packages.map((p) => (
                        <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="py-2 px-4">{p.id}</td>
                            <td className="py-2 px-4">{p.name}</td>
                            <td className="py-2 px-4">{p.category_name}</td>
                            <td className="py-2 px-4">{p.price.toLocaleString()} đ</td>
                            <td
                                className={`py-2 px-4 font-semibold ${p.status === "Đang bán" ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {p.status}
                            </td>
                            <td className="py-2 px-4 flex justify-center gap-3">
                                <button
                                    onClick={() => onEdit(p)}
                                    className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(p.id)}
                                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
};

export default ServicePackageTable;