"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import Header from "@/app/layout/header/Header";
import { getExam } from "@/services/admin/ExamServices";
import { useRouter } from "next/navigation";

interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  examSubjectId: number;
  img?: string; // Thêm thuộc tính img vào interface
}

export default function ExamsList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [examsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [detailModalIsOpen, setDetailModalIsOpen] = useState(false);
  const router = useRouter();

  const fetchExams = async () => {
    try {
      const response = await getExam();
      setExams(response);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Filter exams by search query and sort them
  const filteredExams = exams
    .filter(
      (exam) =>
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle opening the detail modal
  const handleDetails = (exam: Exam) => {
    setSelectedExam(exam);
    setDetailModalIsOpen(true);
  };

  // Handle closing the detail modal
  const closeDetailModal = () => {
    setSelectedExam(null);
    setDetailModalIsOpen(false);
  };

  // Điều hướng đến trang làm bài
  const startExam = (examId: number) => {
    router.push(`/exam/${examId}`); // Điều hướng đến trang làm bài với ID đề thi
  };
  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <>
      {/* Import Header */}
      <Header />

      {/* Main Content */}
      <main className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Danh sách các đề thi
          </h1>

          {/* Search and Sort Functionality */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm đề thi"
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

          {/* Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white border rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => handleDetails(exam)}
              >
                <img
                  src={exam.img}
                  alt={exam.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{exam.title}</h3>
                  <p className="text-gray-600">{exam.description}</p>
                  <p className="text-gray-500">
                    Thời gian: {exam.duration} phút
                  </p>
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
        {detailModalIsOpen && selectedExam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-4">{selectedExam.title}</h2>
              <p className="mb-4">{selectedExam.description}</p>
              <p>Thời gian: {selectedExam.duration} phút</p>

              <div className="flex justify-end gap-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  onClick={() => startExam(selectedExam.id)}
                >
                  Chi tiết
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
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
