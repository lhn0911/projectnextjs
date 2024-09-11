import React, { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  role: number;
  profilePicture: string;
  status: number;
}

export default function UserProfile() {
  const [userLogin, setUserLogin] = useState<User | null>(null);

  useEffect(() => {
    // Lấy dữ liệu userLogin từ Local Storage
    const storedUser = localStorage.getItem("userLogin");
    if (storedUser) {
      setUserLogin(JSON.parse(storedUser));
    }
  }, []);

  if (!userLogin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Thông tin cá nhân
      </h1>

      <div className="flex items-center mb-6">
        <img
          src={userLogin.profilePicture}
          alt="Profile Picture"
          className="w-24 h-24 rounded-full border-2 border-gray-300 mr-6"
        />
        <div>
          <div className="text-xl font-semibold text-gray-800 mb-2">
            {userLogin.username}
          </div>
          <div className="text-gray-600 mb-2">
            <strong>Email:</strong> {userLogin.email}
          </div>
          <div className="text-gray-600 mb-2">
            <strong>Vai trò:</strong>{" "}
            {userLogin.role === 1 ? "Admin" : "Người dùng"}
          </div>
          <div className="text-gray-600 mb-2">
            <strong>Trạng thái:</strong>{" "}
            {userLogin.status === 1 ? "Hoạt động" : "Không hoạt động"}
          </div>
        </div>
      </div>
    </div>
  );
}
