import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

import ServicePackageTable from "../components/Package/ServicePackageTable";
import AddPackageForm from "../components/Package/AddPackageForm";
import UpdatePackageForm from "../components/Package/UpdatePackageForm";
import DeletePackageForm from "../components/Package/DeletePackageForm";
import type { ServicePackageDTO } from "../types/servicePackage";
import { servicePackageApi } from "../api";

const PackageScreen: React.FC = () => {
  const [packages, setPackages] = useState<ServicePackageDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [updatePackage, setUpdatePackage] = useState<ServicePackageDTO | null>(
    null
  );

  const [selectedPackage, setSelectedPackage] =
    useState<ServicePackageDTO | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 👉 Load data từ API
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await servicePackageApi.getAll();
        if (res.succeeded) {
          setPackages(res.data);
        }
      } catch (err) {
        console.error("Error loading packages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // 👉 Thêm gói dịch vụ
  const handleAddPackage = (newPackage: any) => {
    const newItem: ServicePackageDTO = {
      id: (packages.length + 1).toString(),
      packageName: newPackage.packageName,
      description: newPackage.description,
      price: newPackage.price,
      durationMonths: newPackage.durationMonths,
      categoryName: "Danh mục " + newPackage.category_id,
    };

    setPackages((prev) => [...prev, newItem]);
  };

  // 👉 Chọn gói để sửa
  const handleEdit = (pkg: ServicePackageDTO) => {
    setUpdatePackage(pkg);
  };

  // 👉 Cập nhật gói
  const handleUpdatePackage = (updated: any) => {
    setPackages((prev) =>
      prev.map((p) =>
        p.id === updatePackage?.id
          ? {
              ...p,
              packageName: updated.packageName,
              description: updated.description,
              price: updated.price,
              durationMonths: updated.durationMonths,
              categoryName: "Danh mục " + updated.category_id,
            }
          : p
      )
    );
    setUpdatePackage(null);
  };

  // 👉 Mở modal xóa
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
        <h2 className="text-2xl font-bold text-gray-800">
          Quản lý gói dịch vụ
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          <Plus size={18} /> Thêm gói dịch vụ
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <ServicePackageTable
          packages={packages}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Modal Thêm */}
      {showForm && (
        <AddPackageForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddPackage}
        />
      )}

      {/* Modal Sửa */}
      {updatePackage && (
        <UpdatePackageForm
          pkg={updatePackage}
          onClose={() => setUpdatePackage(null)}
          onSubmit={handleUpdatePackage}
        />
      )}

      {/* Modal Xóa */}
      {showDeleteModal && (
        <DeletePackageForm
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeletePackage}
          name={selectedPackage?.packageName || "gói dịch vụ"}
        />
      )}
    </div>
  );
};

export default PackageScreen;
