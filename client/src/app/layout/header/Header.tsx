import React from "react";

export default function Header() {
  return (
    <header className="bg-blue-900 text-white py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/ptit-k5.appspot.com/o/feature2-removebg-preview.png?alt=media&token=32c68b11-43e8-4330-9c1d-3c08522fda37"
          alt="Logo"
          className="h-12 mr-3"
        />
        <h1 className="text-2xl font-bold">Online Exam</h1>
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <a href="/" className="hover:underline">
              Trang chủ
            </a>
          </li>
          <li>
            <a href="/course" className="hover:underline">
              Khóa học
            </a>
          </li>
          <li>
            <a href="/exam" className="hover:underline">
              Bài thi
            </a>
          </li>
          <li>
            <a href="/profile" className="hover:underline">
              Thông tin cá nhân
            </a>
          </li>
          <li>
            <a href="/logout" className="hover:underline">
              Đăng xuất
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
