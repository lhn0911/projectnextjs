import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface User {
  profilePicture: string;
  username: string;
}

export default function Header() {
  const [userLogin, setUserLogin] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const route = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("userLogin");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData) as User;
        setUserLogin(parsedData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userLogin");
    route.push("/login");
  };

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
            <a href="#" className="hover:underline">
              Khóa học
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Bài thi
            </a>
          </li>

          {userLogin ? (
            <li className="relative">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={userLogin.profilePicture}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full mr-2"
                />
                <span>{userLogin.username}</span>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    Thông tin cá nhân
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <a href="/login" className="hover:underline">
                Đăng nhập
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
