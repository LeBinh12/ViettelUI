import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import type { Customer, CustomerAddRequest, CustomerUpdateRequest } from "../types/customer";

import UserTable from "../components/User/UserTable"; // đổi tên component nếu cần
import AddUserForm from "../components/User/AddUserForm"; // bạn có thể copy & đổi thành AddCustomerForm
import UpdateUserForm from "../components/User/UpdateUserForm"; // đổi thành UpdateCustomerForm
import DeleteUserForm from "../components/User/DeleteUserForm"; // đổi thành DeleteCustomerForm
import { customerApi } from "../api/customerApi";


const CustomerScreen: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [updateCustomer, setUpdateCustomer] = useState<Customer | null>(null);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await customerApi.getAll();
        if (res.succeeded) {
          setCustomers(res.data);
        }
      } catch (error) {
        console.error("Error loading customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleAddCustomer = async (req: CustomerAddRequest) => {
    try {
      const res = await customerApi.add(req);
      if (res.succeeded) {
        setCustomers((prev) => [...prev, res.data]);
        toast.success("Thêm khách hàng thành công!");
        setShowForm(false);
      }
    } catch (err) {
      console.error("Failed to add customer", err);
    }
  };

  const handleEdit = (customer: Customer) => {
    setUpdateCustomer(customer);
  };

  const handleUpdateCustomer = async (updated: CustomerUpdateRequest) => {
    try {
      const res = await customerApi.update(updated, updated.id); // gọi API
      if (res.succeeded) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === updated.id ? res.data : c))
        );
        toast.success("Cập nhật khách hàng thành công!");
        setUpdateCustomer(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại");
    }
  };


  // Xóa customer
  const handleDeleteClick = (id: string) => {
    const customer = customers.find((c) => c.id === id);
    if (customer) {
      setSelectedCustomer(customer);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    setDeleting(true);
    try {
      const res = await customerApi.delete(selectedCustomer.id);
      if (res.succeeded) {
        setCustomers((prev) =>
          prev.filter((c) => c.id !== selectedCustomer.id)
        );
        toast.success("Xóa khách hàng thành công!");
        setShowDeleteModal(false);
        setSelectedCustomer(null);
      } else {
        toast.error(res.message || "Xóa khách hàng thất bại!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xóa khách hàng!");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          <Plus size={18} /> Thêm khách hàng
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <UserTable
          customers={customers}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {showForm && (
        <AddUserForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddCustomer}
        />
      )}

      {updateCustomer && (
        <UpdateUserForm
          customer={updateCustomer}
          onClose={() => setUpdateCustomer(null)}
          onSubmit={handleUpdateCustomer}
        />
      )}

      {showDeleteModal && (
        <DeleteUserForm
          isOpen={showDeleteModal}
          name={selectedCustomer?.fullName || "khách hàng"}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteCustomer}
        />
      )}
    </div>
  );
};

export default CustomerScreen;
