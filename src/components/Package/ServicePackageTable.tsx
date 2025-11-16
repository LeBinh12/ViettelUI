import { Pencil, Trash2 } from "lucide-react";
import type { ServicePackageDTO } from "../../types/servicePackage";

interface ServicePackageTableProps {
  packages: ServicePackageDTO[];
  onEdit: (pkg: ServicePackageDTO) => void;
  onDelete: (id: string) => void;
}

const ServicePackageTable: React.FC<ServicePackageTableProps> = ({
  packages,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Tên sản phẩm</th>
            <th className="py-2 px-4 text-left">Danh mục</th>
            <th className="py-2 px-4 text-left">Giá</th>
            <th className="py-2 px-4 text-left">Thời hạng /Tháng</th>
            <th className="py-2 px-4 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((p) => (
            <tr
              key={p.id}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              <td className="py-2 px-4">{p.packageName}</td>
              <td className="py-2 px-4">{p.categoryName}</td>
              <td className="py-2 px-4">{p.price.toLocaleString()} đ</td>
              <td className={`py-2 px-4 font-semibold`}>{p.durationMonths}</td>
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
    </div>
  );
};

export default ServicePackageTable;
