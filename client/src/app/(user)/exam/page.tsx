"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import Header from "@/app/layout/header/Header";
import { getExam } from "@/services/admin/ExamServices";
import { useRouter } from "next/navigation";
import Banner from "@/app/layout/banner/Banner";

interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  examSubjectId: number;
  img?: string;
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

  // Lấy danh sách đề thi từ API
  const fetchExams = async () => {
    try {
      const response = await getExam();
      setExams(response);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Lọc và sắp xếp các đề thi theo tìm kiếm và thứ tự
  const filteredExams = exams
    .filter((exam) =>
      exam.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Điều hướng đến trang câu hỏi của đề thi với examId
  const startExam = (examId: number) => {
    router.push(`/questions/${examId}`); // Điều hướng đến trang câu hỏi
  };

  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <Header />
      <Banner />
      <main className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Danh sách các đề thi
          </h1>

          {/* Tìm kiếm và sắp xếp */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm đề thi"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border p-2 rounded-lg shadow-sm focus:outline-none"
              />
              <button
                onClick={() =>
                  setSortOrder((prevOrder) =>
                    prevOrder === "asc" ? "desc" : "asc"
                  )
                }
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
              >
                {sortOrder === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
              </button>
            </div>
          </div>

          {/* Hiển thị danh sách đề thi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white border rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => startExam(exam.id)} // Khi ấn vào sẽ chuyển sang trang câu hỏi
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

          {/* Phân trang */}
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
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        © 2024 Online Exam. All rights reserved.
      </footer>
    </>
  );
}
