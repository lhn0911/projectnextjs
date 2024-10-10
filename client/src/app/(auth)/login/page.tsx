"use client";
import React, { useState, createContext, useContext } from "react";
import { FaLock, FaFacebook, FaGoogle } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import baseURL from "@/app/api/index";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

// Tạo UserContext
const UserContext = createContext<any>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Component chính
const Login: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setModalContent("Vui lòng điền đầy đủ email và mật khẩu.");
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await baseURL.get("/users");
      const users = response.data;
      const user = users.find((user: any) => user.email === email);

      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
          if (user.status === 0) {
            setModalContent(
              "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin."
            );
            setIsModalOpen(true);
          } else {
            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem("userLogin", JSON.stringify(user));
            // Cập nhật trạng thái người dùng
            setUser(user);
            // Điều hướng dựa trên vai trò
            if (user.role === 1) {
              setModalContent("Chào mừng admin!");
              setIsModalOpen(true);
              setTimeout(() => {
                router.push("/admin");
              }, 2000);
            } else {
              setModalContent("Đăng nhập thành công!");
              setIsModalOpen(true);
              setTimeout(() => {
                router.push("/");
              }, 2000);
            }
          }
        } else {
          setModalContent("Mật khẩu không đúng. Vui lòng thử lại.");
          setIsModalOpen(true);
        }
      } else {
        setModalContent("Email không tồn tại. Vui lòng kiểm tra lại.");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setModalContent("Đã xảy ra lỗi. Vui lòng thử lại.");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-6">Đăng Nhập</h1>
          <div className="mb-4 relative">
            <AiOutlineMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              placeholder="Email hoặc Tên đăng nhập"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-6 relative">
            <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
            <button
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <button
            onClick={handleLogin}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-md w-full mb-4 hover:from-blue-600 hover:to-purple-600"
          >
            ĐĂNG NHẬP
          </button>
          <p className="text-gray-500 mb-4">hoặc</p>
          <div className="flex gap-4 items-center justify-center">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700">
              <FaFacebook className="mr-2" /> Facebook
            </button>
            <button className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-red-600">
              <FaGoogle className="mr-2" /> Google
            </button>
          </div>
          <p className="text-gray-500 mt-6">
            Bạn chưa có tài khoản?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Đăng kí ngay!
            </a>
          </p>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
              <h2 className="text-xl font-bold mb-4">{modalContent}</h2>
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </UserContext.Provider>
  );
};

export default Login;
