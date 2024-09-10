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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Thông tin cá nhân</h1>
      <div>
        <strong>Tên đăng nhập:</strong> {userLogin.username}
      </div>
      <div>
        <strong>Email:</strong> {userLogin.email}
      </div>
      <div>
        <strong>Vai trò:</strong>{" "}
        {userLogin.role === 1 ? "Admin" : "Người dùng"}
      </div>
      <div>
        <strong>Trạng thái:</strong>{" "}
        {userLogin.status === 1 ? "Hoạt động" : "Không hoạt động"}
      </div>
    </div>
  );
}
