"use client";
import React, { useState, useEffect } from "react";
import { getUserById, updateUser } from "@/services/user/UserServices";
import Header from "@/app/layout/header/Header";
import Banner from "@/app/layout/banner/Banner";
export default function UserEdit() {
  const [userLogin, setUserLogin] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);
  const [notificationModalIsOpen, setNotificationModalIsOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("userLogin");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserLogin(parsedUser);
      getUserById(parsedUser.id)
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => console.error(error));
    }
  }, []);

  const showNotification = (message: string) => {
    setNotificationMessage(message);
    setNotificationModalIsOpen(true);
  };

  const handleSaveChanges = async () => {
    if (userData) {
      try {
        // Gọi API để lưu dữ liệu vào file JSON
        await updateUser(userData);
        showNotification("Lưu thành công!");
        setEditModalIsOpen(false);
      } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error);
        showNotification("Lỗi khi lưu dữ liệu. Vui lòng thử lại.");
      }
    }
  };

  const handlePasswordChange = () => {
    if (currentPassword && newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        showNotification("Mật khẩu mới và xác nhận mật khẩu không khớp!");
        return;
      }
      // In a real app, you'd verify the current password against the stored hash
      // and properly hash the new password before storing
      try {
        const updatedUserData = { ...userData, password: newPassword };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        showNotification("Đổi mật khẩu thành công!");
        setPasswordModalIsOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        showNotification("Lỗi khi đổi mật khẩu. Vui lòng thử lại.");
      }
    } else {
      showNotification("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Header />
      <Banner />
      <main>
        <div className="p-6">
          {userData && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Thông tin người dùng</h2>
              <img
                src={userData.profilePicture || "/default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
              <p>
                <strong>ID:</strong> {userData.id}
              </p>
              <p>
                <strong>Tên đăng nhập:</strong> {userData.username}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Vai trò:</strong>{" "}
                {userData.role === 1 ? "Admin" : "User"}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {userData.status === 1 ? "Hoạt động" : "Không hoạt động"}
              </p>
              <button
                onClick={() => setEditModalIsOpen(true)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Sửa thông tin
              </button>
            </div>
          )}

          {editModalIsOpen && userData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-md text-center max-w-md w-full">
                <h2 className="text-xl mb-4">Chỉnh sửa thông tin</h2>
                <div className="mb-4">
                  <label className="block text-left mb-2">Tên đăng nhập</label>
                  <input
                    type="text"
                    value={userData.username}
                    onChange={(e) =>
                      setUserData({ ...userData, username: e.target.value })
                    }
                    className="border border-gray-300 rounded-md py-2 px-4 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-left mb-2">Email</label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    className="border border-gray-300 rounded-md py-2 px-4 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-left mb-2">Ảnh đại diện</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full"
                  />
                </div>
                <button
                  onClick={() => setPasswordModalIsOpen(true)}
                  className="mb-4 bg-yellow-500 text-white py-2 px-4 rounded-md"
                >
                  Đổi mật khẩu
                </button>
                <div>
                  <button
                    onClick={handleSaveChanges}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setEditModalIsOpen(false)}
                    className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-md"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {passwordModalIsOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-md text-center max-w-md w-full">
                <h2 className="text-xl mb-4">Đổi mật khẩu</h2>
                <div className="mb-4">
                  <label className="block text-left mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-left mb-2">Mật khẩu mới</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-left mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full"
                  />
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  Đồng ý
                </button>
                <button
                  onClick={() => {
                    setPasswordModalIsOpen(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-md"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {notificationModalIsOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-md text-center max-w-md w-full">
                <h2 className="text-xl mb-4">Thông báo</h2>
                <p>{notificationMessage}</p>
                <button
                  onClick={() => setNotificationModalIsOpen(false)}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        © 2024 Online Exam. All rights reserved.
      </footer>
    </>
  );
}
