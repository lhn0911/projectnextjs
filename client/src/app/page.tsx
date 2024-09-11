"use client";
import React from "react";
import Header from "@/app/layout/header/Header";
import Banner from "@/app/layout/banner/Banner";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Banner />
      <main className="flex-1 bg-gray-100 p-6">
        <h2 className="text-3xl font-bold mb-6">Trang web thi online</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Danh sách môn thi */}
          <div
            className="block bg-white shadow-md rounded-lg p-6 text-center cursor-pointer hover:bg-gray-200 transition"
            onClick={() => handleNavigation("/subject")}
          >
            <img
              className="w-max h-80"
              src="https://img.pikbest.com/ai/illus_our/20230426/3b71c28eff0d361a911d544436a3f93b.jpg!sw800"
            />
            <h3 className="text-xl font-semibold mb-4">Danh sách môn thi</h3>
            <p>Nhấp để xem danh sách các môn thi.</p>
          </div>

          {/* Danh sách đề thi */}
          <div
            className="block bg-white shadow-md rounded-lg p-6 text-center cursor-pointer hover:bg-gray-200 transition"
            onClick={() => handleNavigation("/exam")}
          >
            <img
              className="w-max h-80"
              src="https://ketnoigiaoduc.vn/upload_images/images/de-thi-thu-co-sat-truoc-van-la-cach-de-dat-thanh-cong-1.png"
              alt=""
            />
            <h3 className="text-xl font-semibold mb-4">Danh sách đề thi</h3>
            <p>Nhấp để xem danh sách các đề thi.</p>
          </div>

          {/* Khóa luyện thi */}
          <div
            className="block bg-white shadow-md rounded-lg p-6 text-center cursor-pointer hover:bg-gray-200 transition"
            onClick={() => handleNavigation("/course")}
          >
            <img
              className="w-max h-80"
              src="https://zestart.vn/wp-content/uploads/2023/02/22-1.png"
              alt=""
            />
            <h3 className="text-xl font-semibold mb-4">Khóa luyện thi</h3>
            <p>Nhấp để xem các khóa luyện thi.</p>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        © 2024 Online Exam. All rights reserved.
      </footer>
    </div>
  );
}
