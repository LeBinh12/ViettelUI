import React, { useState } from "react";
import { Plus } from "lucide-react";
import type { Package } from "../types/product";
import { mockPackages } from "../data/mock/product.mock";
import ServicePackageTable from "../components/Package/ServicePackageTable";
import AddPackageForm from "../components/Package/AddPackageForm";
import UpdatePackageForm from "../components/Package/UpdatePackageForm";
import DeletePackageForm from "../components/Package/DeletePackageForm";

const PackageScreen: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>(mockPackages);
  const [showForm, setShowForm] = useState(false);
  const [updatePackage, setUpdatePackage] = useState<Package | null>(null);

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 👉 Thêm gói dịch vụ
  const handleAddPackage = (newPackage: any) => {
    const newItem = {
      id: (packages.length + 1).toString(),
      ...newPackage,
      category_name: "Danh mục " + newPackage.category_id,
    };
    setPackages((prev) => [...prev, newItem]);
  };

  // 👉 Sửa gói
  const handleEdit = (pkg: Package) => {
    setUpdatePackage(pkg);
  };

  // 👉 Cập nhật gói
  const handleUpdatePackage = (updatedData: any) => {
    setPackages((prev) =>
      prev.map((p) =>
        p.id === updatePackage?.id
          ? { ...p, ...updatedData, category_name: "Danh mục " + updatedData.category_id }
          : p
      )
    );
    setUpdatePackage(null);
  };

  // 👉 Mở modal xác nhận xóa
  const handleDeleteClick = (id: string) => {
    const pkg = packages.find((p) => p.id === id);
    if (pkg) {
      setSelectedPackage(pkg);
      setShowDeleteModal(true);
    }
  };

  // 👉 Xác nhận xóa
  const handleDeletePackage = () => {
    if (!selectedPackage) return;

    setDeleting(true);
    // Mô phỏng API
    setTimeout(() => {
      setPackages((prev) => prev.filter((p) => p.id !== selectedPackage.id));
      setShowDeleteModal(false);
      setSelectedPackage(null);
      setDeleting(false);
    }, 600);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý gói dịch vụ</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          <Plus size={18} /> Thêm gói dịch vụ
        </button>
      </div>

      {/* Bảng danh sách */}
      <ServicePackageTable
        packages={packages}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Modal thêm */}
      {showForm && (
        <AddPackageForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddPackage}
        />
      )}

      {/* Modal cập nhật */}
      {updatePackage && (
        <UpdatePackageForm
          pkg={updatePackage}
          onClose={() => setUpdatePackage(null)}
          onSubmit={handleUpdatePackage}
        />
      )}

      {/* Modal xóa */}
      {showDeleteModal && (
        <DeletePackageForm
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeletePackage}
          name={selectedPackage?.name || "gói dịch vụ"}
        />
      )}
    </div>
  );
};

export default PackageScreen;
