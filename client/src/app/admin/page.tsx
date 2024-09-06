"use client";
import React, { useState } from "react";
import {
  IoMenu,
  IoPerson,
  IoDocumentText,
  IoBook,
  IoLogOut,
} from "react-icons/io5";
import UserManagement from "@/app/admin/users/page"; // Import the UserManagement component

const AdminDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState("user-management");
  const [userName, setUserName] = useState("Admin"); // Example admin name

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Admin logged out");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <h1 className="text-xl font-semibold mb-4">Admin Dashboard</h1>
        <ul>
          <li
            className={`mb-2 cursor-pointer ${
              activeMenu === "user-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveMenu("user-management")}
          >
            <IoPerson className="inline-block mr-2" /> Quản lý user
          </li>
          <li
            className={`mb-2 cursor-pointer ${
              activeMenu === "exam-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveMenu("exam-management")}
          >
            <IoDocumentText className="inline-block mr-2" /> Quản lý đề thi
          </li>
          <li
            className={`mb-2 cursor-pointer ${
              activeMenu === "lesson-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveMenu("lesson-management")}
          >
            <IoBook className="inline-block mr-2" /> Quản lý bài học
          </li>
          <li
            className={`mb-2 cursor-pointer ${
              activeMenu === "profile-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveMenu("profile-management")}
          >
            <IoPerson className="inline-block mr-2" /> Chỉnh sửa thông tin
          </li>
          <li className="cursor-pointer" onClick={handleLogout}>
            <IoLogOut className="inline-block mr-2" /> Đăng xuất
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        {activeMenu === "user-management" && <UserManagement />}
        {activeMenu === "exam-management" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Danh sách đề thi</h2>
            {/* Render exam management functionalities here */}
          </div>
        )}
        {activeMenu === "lesson-management" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Danh sách bài học</h2>
            {/* Render lesson management functionalities here */}
          </div>
        )}
        {activeMenu === "profile-management" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Chỉnh sửa thông tin cá nhân
            </h2>
            {/* Render profile management functionalities here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
