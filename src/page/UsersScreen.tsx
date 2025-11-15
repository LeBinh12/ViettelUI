import React, { useState } from "react";
import { Plus } from "lucide-react";
import type { User } from "../types/user";
import { mockUsers } from "../data/mock/user.mock";
import UserTable from "../components/User/UserTable";
import AddUserForm from "../components/User/AddUserForm";
import UpdateUserForm from "../components/User/UpdateUserForm";
import DeleteUserForm from "../components/User/DeleteUserForm";

const UserScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updateUser, setUpdateUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAddUser = (data: Omit<User, "id">) => {
    const newUser: User = { id: users.length + 1, ...data };
    setUsers((prev) => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedData: Partial<Omit<User, "id">>) => {
    if (!updateUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === updateUser.id ? { ...u, ...updatedData } : u))
    );
    setUpdateUser(null);
  };

  const handleDeleteClick = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          <Plus size={18} /> Thêm người dùng
        </button>
      </div>

      <UserTable users={users} onEdit={setUpdateUser} onDelete={handleDeleteClick} />

      {showAddModal && <AddUserForm onClose={() => setShowAddModal(false)} onSubmit={handleAddUser} />}

      {updateUser && <UpdateUserForm user={updateUser} onClose={() => setUpdateUser(null)} onSubmit={handleUpdateUser} />}

      {showDeleteModal && (
        <DeleteUserForm
          isOpen={showDeleteModal}
          name={selectedUser?.name || "người dùng"}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default UserScreen;
