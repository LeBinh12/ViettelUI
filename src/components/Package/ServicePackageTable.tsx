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
      <table className="min-w-full bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
          <tr>
            <th className="py-3 px-4 text-center font-medium w-16">STT</th>
            <th className="py-3 px-4 text-left font-medium">Tên sản phẩm</th>
            <th className="py-3 px-4 text-left font-medium">Danh mục</th>
            <th className="py-3 px-4 text-left font-medium">Giá</th>
            <th className="py-3 px-4 text-left font-medium">Thời hạn / Tháng</th>
            <th className="py-3 px-4 text-center font-medium">Hành động</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {packages.map((p, index) => (
            <tr
              key={p.id}
              className="border-b border-gray-200 hover:bg-indigo-50/40 transition-colors"
            >
              <td className="py-3 px-4 text-center font-semibold text-gray-700">
                {index + 1}
              </td>

              <td className="py-3 px-4">{p.packageName}</td>
              <td className="py-3 px-4">{p.categoryName}</td>
              <td className="py-3 px-4">{p.price.toLocaleString()} đ</td>

              <td className="py-3 px-4 font-semibold text-gray-700">
                {p.durationMonths}
              </td>

              <td className="py-3 px-4 flex justify-center items-center gap-3">
                {/* Edit */}
                <button
                  onClick={() => onEdit(p)}
                  className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition shadow-sm"
                >
                  <Pencil size={18} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDelete(p.id)}
                  className="p-2 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 transition shadow-sm"
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
