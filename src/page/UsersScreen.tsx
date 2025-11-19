import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import type { Customer } from "../types/customer";

import UserTable from "../components/User/UserTable"; // đổi tên component nếu cần
import AddUserForm from "../components/User/AddUserForm"; // bạn có thể copy & đổi thành AddCustomerForm
import UpdateUserForm from "../components/User/UpdateUserForm"; // đổi thành UpdateCustomerForm
import DeleteUserForm from "../components/User/DeleteUserForm"; // đổi thành DeleteCustomerForm
import { customerApi } from "../api/customerApi";

const CustomerScreen: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [updateCustomer, setUpdateCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 👉 Load dữ liệu từ API
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await customerApi.getAll();
        if (res.succeeded) {
          setCustomers(res.data);
        } else {
          toast.error("Không thể tải dữ liệu khách hàng!");
        }
      } catch (error) {
        console.error("Error loading customers:", error);
        toast.error("Lỗi tải dữ liệu khách hàng!");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Xóa customer
  const handleDeleteClick = (id: string) => {
    const cust = customers.find((c) => c.id === id);
    if (cust) {
      setSelectedCustomer(cust);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      setLoading(true);
      const res = await customerApi.delete(selectedCustomer.id);

      if (res.succeeded) {
        setCustomers((prev) =>
          prev.filter((c) => c.id !== selectedCustomer.id)
        );
        toast.success("Xóa khách hàng thành công!");
      } else {
        toast.error(res.message || "Xóa khách hàng thất bại!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xóa khách hàng!");
    } finally {
      setShowDeleteModal(false);
      setSelectedCustomer(null);
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          <Plus size={18} /> Thêm khách hàng
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <UserTable
          customers={customers} // giữ UserTable nhưng truyền Customer
          onEdit={setUpdateCustomer}
          onDelete={handleDeleteClick}
        />
      )}

      {showAddModal && (
        <AddUserForm
          onClose={() => setShowAddModal(false)}
          onSubmit={(newCustomer: Customer) => {
            setCustomers((prev) => [...prev, newCustomer]);
          }}
        />
      )}

      {updateCustomer && (
        <UpdateUserForm
          customer={updateCustomer}
          onClose={() => setUpdateCustomer(null)}
          onSubmit={(updatedCustomer: Customer) => {
            setCustomers((prev) =>
              prev.map((c) =>
                c.id === updatedCustomer.id ? updatedCustomer : c
              )
            );
          }}
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
