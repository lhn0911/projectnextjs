"use client";
import React, { useState } from "react";
import { IoPerson, IoDocumentText, IoBook, IoLogOut } from "react-icons/io5";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { FaFileArchive } from "react-icons/fa";
import UserManagement from "@/app/admin/users/page"; // User Management Component
import ExamManagement from "@/app/admin/exam/page"; // Exam Management Component
import SubjectManagement from "@/app/admin/subject/page"; // Subject Management Component
import QuestionManagement from "@/app/admin/question/page"; // Question Management Component
import ProfileManagement from "@/app/admin/profile/page"; // Profile Management Component
import CourseManagement from "@/app/admin/course/page"; // Course Management Component
import { useRouter } from "next/navigation";

const AdminDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState("user-management");
  const route = useRouter(); // Sử dụng useRouter để chuyển hướng

  const handleLogout = () => {
    localStorage.removeItem("userLogin");

    // Chuyển hướng người dùng về trang login
    route.push("/login");
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
              activeMenu === "course-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveMenu("course-management")}
          >
            <IoDocumentText className="inline-block mr-2" /> Quản lý khóa luyện
            thi
          </li>
          <li
            className={`mb-2 cursor-pointer ${
              activeMenu === "subject-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveMenu("subject-management")}
          >
            <IoBook className="inline-block mr-2" /> Quản lý môn thi
          </li>
          <li
            className={`mb-2 cursor-pointer ${
              activeMenu === "exam-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveMenu("exam-management")}
          >
            <FaFileArchive className="inline-block mr-2" /> Quản lý đề thi
          </li>
          <li
            className={`mb-2 cursor-pointer ${
              activeMenu === "question-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveMenu("question-management")}
          >
            <FaFileCircleQuestion className="inline-block mr-2" /> Quản lý câu
            hỏi
          </li>
          <li
            className={`mb-2 cursor-pointer ${
              activeMenu === "profile-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveMenu("profile-management")}
          >
            <IoPerson className="inline-block mr-2" /> Thông tin cá nhân
          </li>
          <li className="cursor-pointer" onClick={handleLogout}>
            <IoLogOut className="inline-block mr-2" /> Đăng xuất
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        {activeMenu === "user-management" && <UserManagement />}
        {activeMenu === "course-management" && <CourseManagement />}
        {activeMenu === "subject-management" && <SubjectManagement />}
        {activeMenu === "exam-management" && <ExamManagement />}
        {activeMenu === "question-management" && <QuestionManagement />}
        {activeMenu === "profile-management" && <ProfileManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
