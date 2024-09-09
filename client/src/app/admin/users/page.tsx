"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import {
  getUsers,
  updateUser,
  deleteUser,
} from "@/services/admin/UserServices";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: number;
  profilePicture: string;
  status: number;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.username.localeCompare(b.username);
      } else {
        return b.username.localeCompare(a.username);
      }
    });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalIsOpen(true);
  };

  const handleDelUser = (user: User) => {
    setSelectedUser(user);
    setDeleteModalIsOpen(true);
  };

  const handleSaveChanges = async () => {
    if (selectedUser) {
      try {
        await updateUser(selectedUser);
        await fetchUsers();
        setEditModalIsOpen(false);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.id);
        await fetchUsers();
        setDeleteModalIsOpen(false);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const closeModal = () => {
    setEditModalIsOpen(false);
    setDeleteModalIsOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md py-2 px-4 mr-4"
        />
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="flex items-center border border-gray-300 rounded-md py-2 px-4"
        >
          <FaSearch className="mr-2" />
          {sortOrder === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
        </button>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b text-center">Tên đăng nhập</th>
            <th className="py-2 px-4 border-b text-center">Email</th>
            <th className="py-2 px-4 border-b text-center">Vai trò</th>
            <th className="py-2 px-4 border-b text-center">Trạng thái</th>
            <th className="py-2 px-4 border-b text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b text-center">{user.id}</td>
              <td className="py-2 px-4 border-b text-center">
                {user.username}
              </td>
              <td className="py-2 px-4 border-b text-center">{user.email}</td>
              <td className="py-2 px-4 border-b text-center">
                {user.role === 1 ? "Admin" : "User"}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {user.status === 0 ? "Khóa" : "Hoạt động"}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelUser(user)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center">
        {Array.from(
          { length: Math.ceil(filteredUsers.length / usersPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>

      {editModalIsOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md text-center">
            <h2 className="text-xl mb-4">Chỉnh sửa người dùng</h2>
            <div className="mb-4">
              <label className="block text-left mb-2">Vai trò</label>
              <select
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser(
                    (prev) => prev && { ...prev, role: +e.target.value }
                  )
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              >
                <option value={0}>User</option>
                <option value={1}>Admin</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2">Trạng thái</label>
              <select
                value={selectedUser.status}
                onChange={(e) =>
                  setSelectedUser(
                    (prev) => prev && { ...prev, status: +e.target.value }
                  )
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              >
                <option value={0}>Khóa</option>
                <option value={1}>Hoạt động</option>
              </select>
            </div>
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Lưu
            </button>
            <button
              onClick={closeModal}
              className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-md"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {deleteModalIsOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md w-1/3">
            <h2 className="text-xl mb-4">Xóa người dùng</h2>
            <p>Bạn có chắc chắn muốn xóa người dùng {selectedUser.username}?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Xóa
              </button>
              <button
                onClick={() => setDeleteModalIsOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
