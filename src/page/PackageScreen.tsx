import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

import ServicePackageTable from "../components/Package/ServicePackageTable";
import AddPackageForm from "../components/Package/AddPackageForm";
import UpdatePackageForm from "../components/Package/UpdatePackageForm";
import DeletePackageForm from "../components/Package/DeletePackageForm";
import type {
  ServicePackageAddRequest,
  ServicePackageDTO,
  ServicePackageUpdateRequest,
} from "../types/servicePackage";
import { servicePackageApi } from "../api";
import { toast } from "react-toastify";

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

  // Thêm gói dịch vụ
  const handleAddPackage = async (req: ServicePackageAddRequest) => {
    try {
      const res = await servicePackageApi.add(req);
      if (res.succeeded) {
        setPackages((prev) => [...prev, res.data]);
        toast.success("Thêm gói dịch vụ thành công!");
        setShowForm(false);
      }
    } catch (err) {
      console.error("Failed to add package", err);
    }
  };

  // Chọn gói để sửa
  const handleEdit = (pkg: ServicePackageDTO) => {
    setUpdatePackage(pkg);
  };

  // Cập nhật gói
  const handleUpdatePackage = async (updated: ServicePackageUpdateRequest) => {
    try {
      const res = await servicePackageApi.update(updated); // gọi API

      if (res.succeeded) {
        const updatedPkg = res.data; // object ServicePackageDTO

        setPackages((prev) =>
          prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p))
        );

        toast.success("Cập nhật gói dịch vụ thành công!");
        setUpdatePackage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại");
    }
  };

  // 👉 Mở modal xóa
  const handleDeleteClick = (id: string) => {
    const pkg = packages.find((p) => p.id === id);
    if (pkg) {
      setSelectedPackage(pkg);
      setShowDeleteModal(true);
    }
  };

  // Xác nhận xóa
  const handleDeletePackage = async () => {
    if (!selectedPackage) return;
    setDeleting(true);
    console.log("selectedPackage.id", selectedPackage.id);
    try {
      const res = await servicePackageApi.delete(selectedPackage.id); // gọi API delete
      console.log("res", res);
      if (res.succeeded && res.data) {
        setPackages((prev) => prev.filter((p) => p.id !== selectedPackage.id));
        toast.success("Xóa gói dịch vụ thành công!");
        setShowDeleteModal(false);
        setSelectedPackage(null);
      } else {
        toast.error("Xóa thất bại!");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Xóa thất bại!");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      {/* <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Quản lý gói dịch vụ
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white 
             bg-gradient-to-r from-indigo-500 to-indigo-600 
             shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-indigo-700 
             transition-all duration-300"
        >
          <Plus size={18} /> Thêm gói dịch vụ
        </button>

      </div> */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white 
               bg-gradient-to-r from-indigo-500 to-indigo-600 
               shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-indigo-700 
               transition-all duration-300"
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
