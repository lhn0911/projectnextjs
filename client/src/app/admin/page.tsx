"use client";
import React, { useState, useEffect } from "react";
import { IoPerson, IoDocumentText, IoBook, IoLogOut } from "react-icons/io5";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { FaFileArchive } from "react-icons/fa";
import UserManagement from "@/app/admin/users/page";
import ExamManagement from "@/app/admin/exam/page";
import SubjectManagement from "@/app/admin/subject/page";
import QuestionManagement from "@/app/admin/question/page";
import ProfileManagement from "@/app/admin/profile/page";
import CourseManagement from "@/app/admin/course/page";
import { useRouter } from "next/navigation";

const AdminDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState("user-management");
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const route = useRouter();

  useEffect(() => {
    const userLogin = localStorage.getItem("userLogin");
    setIsLoggedIn(!!userLogin); // Cập nhật trạng thái đăng nhập
    if (!userLogin) {
      setShowModal(true);
    }
  }, []); // Chỉ chạy một lần khi component mount

  const handleLogout = () => {
    localStorage.removeItem("userLogin");
    setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
    route.push("/login");
  };

  const handleMenuClick = (menu: string) => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      setActiveMenu(menu);
    }
  };

  const handleConfirmLogin = () => {
    setShowModal(false);
    route.push("/login");
  };

  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <h1 className="text-xl font-semibold mb-4">Admin Dashboard</h1>
        <ul>
          <li
            className={`mb-2 cursor-pointer ${
              activeMenu === "user-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleMenuClick("user-management")}
          >
            <IoPerson className="inline-block mr-2" /> Quản lý user
          </li>
          <li
            className={`mb-2 cursor-pointer ${
              activeMenu === "course-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleMenuClick("course-management")}
          >
            <IoDocumentText className="inline-block mr-2" /> Quản lý khóa luyện
            thi
          </li>
          <li
            className={`mb-2 cursor-pointer ${
              activeMenu === "subject-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleMenuClick("subject-management")}
          >
            <IoBook className="inline-block mr-2" /> Quản lý môn thi
          </li>
          <li
            className={`mb-2 cursor-pointer ${
              activeMenu === "exam-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleMenuClick("exam-management")}
          >
            <FaFileArchive className="inline-block mr-2" /> Quản lý đề thi
          </li>
          <li
            className={`mb-2 cursor-pointer ${
              activeMenu === "question-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleMenuClick("question-management")}
          >
            <FaFileCircleQuestion className="inline-block mr-2" /> Quản lý câu
            hỏi
          </li>
          <li
            className={`mb-2 cursor-pointer ${
              activeMenu === "profile-management" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleMenuClick("profile-management")}
          >
            <IoPerson className="inline-block mr-2" /> Thông tin cá nhân
          </li>
          <li className="cursor-pointer" onClick={handleLogout}>
            <IoLogOut className="inline-block mr-2" /> Đăng xuất
          </li>
        </ul>
      </div>

      <div className="flex-1 p-4">
        {activeMenu === "user-management" && <UserManagement />}
        {activeMenu === "course-management" && <CourseManagement />}
        {activeMenu === "subject-management" && <SubjectManagement />}
        {activeMenu === "exam-management" && <ExamManagement />}
        {activeMenu === "question-management" && <QuestionManagement />}
        {activeMenu === "profile-management" && <ProfileManagement />}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md w-1/3">
            <h2 className="text-xl mb-4">Cảnh báo</h2>
            <p>Bạn cần đăng nhập để truy cập vào trang quản lý.</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleConfirmLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setShowModal(false)}
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
};

export default AdminDashboard;
