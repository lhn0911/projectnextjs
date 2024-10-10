"use client";
import React, { useState } from "react";
import { FaUser, FaLock, FaFacebook, FaGoogle } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import bcrypt from "bcryptjs";
import { createUser } from "@/services/user/UserServices"; // Import hàm createUser từ services_users
import baseUrl from "@/app/api/index";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Page() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter(); // Khai báo useRouter

  // Kiểm tra email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.endsWith("@gmail.com"); // Kiểm tra phải là gmail
  };

  // Kiểm tra trùng username
  const checkUsernameExists = async (username: string) => {
    try {
      const response = await baseUrl.get("/users");
      const users = response.data;
      return users.some((user: any) => user.username === username);
    } catch (error) {
      console.error("Error fetching users:", error);
      return false;
    }
  };

  // ID random
  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const handleRegister = async () => {
    if (!isValidEmail(email)) {
      setModalMessage("Email phải là dạng @gmail.com. Vui lòng kiểm tra lại.");
      setShowModal(true);
      return;
    }

    if (password.length < 5) {
      setModalMessage("Mật khẩu phải chứa ít nhất 5 ký tự.");
      setShowModal(true);
      return;
    }

    if (password !== confirmPassword) {
      setModalMessage("Mật khẩu không khớp. Vui lòng kiểm tra lại.");
      setShowModal(true);
      return;
    }

    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      setModalMessage("Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.");
      setShowModal(true);
      return;
    }

    // Hàm mã hóa pass
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: generateRandomId(), // Random ID
      username,
      email,
      password: hashedPassword, // Mã hóa pass
      role: 0, // Mặc định 0 là user
      profilePicture: "", // Mặc định trống
      status: 1, // Mặc định không khóa
    };

    try {
      await createUser(newUser); // Sử dụng hàm createUser từ dịch vụ
      setModalMessage("Đăng ký thành công! ");
      setShowModal(true);
      setTimeout(() => {
        router.push("/login"); // Chuyển hướng đến trang đăng nhập
      }, 2000); // Thời gian chờ trước khi chuyển hướng
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      setModalMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
      setShowModal(true);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6">Đăng Ký</h1>
        <div className="mb-4 relative">
          <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div className="mb-4 relative">
          <AiOutlineMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div className="mb-4 relative">
          <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
          {showPassword ? (
            <FiEyeOff
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <FiEye
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
        <div className="mb-6 relative">
          <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
          {showConfirmPassword ? (
            <FiEyeOff
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowConfirmPassword(false)}
            />
          ) : (
            <FiEye
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowConfirmPassword(true)}
            />
          )}
        </div>
        <button
          onClick={handleRegister}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-md w-full mb-4 hover:from-blue-600 hover:to-purple-600"
        >
          ĐĂNG KÝ
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
          Bạn đã có tài khoản?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Đăng nhập ngay!
          </a>
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md text-center">
            <p>{modalMessage}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
