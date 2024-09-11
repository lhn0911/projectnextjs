"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Import useRouter để điều hướng
import Header from "@/app/layout/header/Header"; // Import Header layout
import { getSubject } from "@/services/admin/SubjectServices";
import Banner from "@/app/layout/banner/Banner";
interface Subject {
  id: number;
  title: string;
  description: string;
  coursesId: number;
  img: string;
}

export default function Subject() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [subjectsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [detailModalIsOpen, setDetailModalIsOpen] = useState(false);
  const router = useRouter(); // Sử dụng useRouter để điều hướng

  // Fetch subjects từ API
  const fetchSubjects = async () => {
    try {
      const response = await getSubject();
      setSubjects(response);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Filter và sắp xếp subjects
  const filteredSubjects = subjects
    .filter(
      (subject) =>
        subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = filteredSubjects.slice(
    indexOfFirstSubject,
    indexOfLastSubject
  );

  const totalPages = Math.ceil(filteredSubjects.length / subjectsPerPage);

  // Tạo danh sách số trang
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Mở modal chi tiết
  const handleDetails = (subject: Subject) => {
    setSelectedSubject(subject);
    setDetailModalIsOpen(true);
  };

  // Đóng modal chi tiết
  const closeDetailModal = () => {
    setSelectedSubject(null);
    setDetailModalIsOpen(false);
  };

  // Chuyển đến trang chi tiết
  const handleLearnMore = (id: number) => {
    router.push(`/subject/${id}`); // Điều hướng tới trang chi tiết của môn học
  };

  return (
    <>
      {/* Import Header */}
      <Header />
      <Banner />
      {/* Main Content */}
      <main className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Danh sách các môn thi
          </h1>

          {/* Search và Sort */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm môn thi"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border p-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
              <button
                onClick={() =>
                  setSortOrder((prevOrder) =>
                    prevOrder === "asc" ? "desc" : "asc"
                  )
                }
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:outline-none"
              >
                {sortOrder === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
              </button>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentSubjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-white border rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => handleDetails(subject)}
              >
                <img
                  src={subject.img}
                  alt={subject.title}
                  className="w-full h-96 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{subject.title}</h3>
                  <p className="text-gray-600">{subject.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 rounded-lg shadow ${
                  currentPage === number
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        </div>

        {/* Detail Modal */}
        {detailModalIsOpen && selectedSubject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-4">
                {selectedSubject.title}
              </h2>
              <p className="mb-4">{selectedSubject.description}</p>

              {/* Nút Học thử */}
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  onClick={() => handleLearnMore(selectedSubject.id)}
                >
                  Học
                </button>
                <button
                  className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={closeDetailModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        © 2024 Online Exam. All rights reserved.
      </footer>
    </>
  );
}
