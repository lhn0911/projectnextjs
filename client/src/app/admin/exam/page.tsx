"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import {
  getExam,
  addExam,
  updateExam,
  deleteExam,
  getExamSubjects, // Giả sử bạn có một hàm này để lấy danh sách môn thi
} from "@/services/admin/ExamServices";

interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  examSubjectId: number;
}

interface ExamSubject {
  id: number;
  name: string;
  title: string;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examSubjects, setExamSubjects] = useState<ExamSubject[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [examsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [newExam, setNewExam] = useState<Exam>({
    id: 0,
    title: "",
    description: "",
    duration: 0,
    examSubjectId: 0,
  });

  const fetchExams = async () => {
    try {
      const response = await getExam();
      setExams(response);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const fetchExamSubjects = async () => {
    try {
      const response = await getExamSubjects();
      setExamSubjects(response);
    } catch (error) {
      console.error("Error fetching exam subjects:", error);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchExamSubjects(); // Lấy danh sách môn thi khi component mount
  }, []);

  const filteredExams = exams
    .filter((exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });

  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEdit = (exam: Exam) => {
    setSelectedExam(exam);
    setEditModalIsOpen(true);
  };

  const handleAdd = () => {
    setNewExam({
      id: 0,
      title: "",
      description: "",
      duration: 0,
      examSubjectId: 0,
    });
    setAddModalIsOpen(true);
  };

  const handleDelExam = (exam: Exam) => {
    setSelectedExam(exam);
    setDeleteModalIsOpen(true);
  };

  const handleSaveChanges = async () => {
    if (selectedExam) {
      try {
        await updateExam(selectedExam);
        await fetchExams();
        setEditModalIsOpen(false);
      } catch (error) {
        console.error("Error updating exam:", error);
      }
    }
  };

  const handleAddExam = async () => {
    try {
      await addExam(newExam);
      await fetchExams();
      setAddModalIsOpen(false);
    } catch (error) {
      console.error("Error adding exam:", error);
    }
  };

  const handleDeleteExam = async () => {
    if (selectedExam) {
      try {
        await deleteExam(selectedExam.id);
        await fetchExams();
        setDeleteModalIsOpen(false);
      } catch (error) {
        console.error("Error deleting exam:", error);
      }
    }
  };

  const closeModal = () => {
    setEditModalIsOpen(false);
    setAddModalIsOpen(false);
    setDeleteModalIsOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md py-2 px-4 mr-4"
        />
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="flex items-center border border-gray-300 rounded-md py-2 px-4"
        >
          <FaSearch className="mr-2" />
          {sortOrder === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
        </button>
        <button
          onClick={handleAdd}
          className="ml-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Thêm Đề Thi
        </button>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b text-center">Tiêu đề</th>
            <th className="py-2 px-4 border-b text-center">Mô tả</th>
            <th className="py-2 px-4 border-b text-center">Khóa học ID</th>
            <th className="py-2 px-4 border-b text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentExams.map((exam) => (
            <tr key={exam.id}>
              <td className="py-2 px-4 border-b text-center">{exam.id}</td>
              <td className="py-2 px-4 border-b text-center">{exam.title}</td>
              <td className="py-2 px-4 border-b text-center">
                {exam.description}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {exam.examSubjectId}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => handleEdit(exam)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelExam(exam)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center">
        {Array.from(
          { length: Math.ceil(filteredExams.length / examsPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>

      {editModalIsOpen && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md text-center">
            <h2 className="text-xl mb-4">Chỉnh sửa đề thi</h2>
            <div className="mb-4">
              <label className="block text-left mb-2">Tiêu đề</label>
              <input
                type="text"
                value={selectedExam.title || ""}
                onChange={(e) =>
                  setSelectedExam(
                    (prev) => prev && { ...prev, title: e.target.value }
                  )
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2">Mô tả</label>
              <input
                type="text"
                value={selectedExam.description || ""}
                onChange={(e) =>
                  setSelectedExam(
                    (prev) => prev && { ...prev, description: e.target.value }
                  )
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2">Thời gian (phút)</label>
              <input
                type="number"
                value={selectedExam.duration || 0}
                onChange={(e) =>
                  setSelectedExam(
                    (prev) => prev && { ...prev, duration: +e.target.value }
                  )
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2">Môn thi</label>
              <select
                value={selectedExam.examSubjectId || 0}
                onChange={(e) =>
                  setSelectedExam(
                    (prev) =>
                      prev && { ...prev, examSubjectId: +e.target.value }
                  )
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              >
                <option value={0}>Chọn môn thi</option>
                {examSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.title}{" "}
                    {/* Sử dụng subject.title thay vì subject.name */}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Lưu thay đổi
            </button>
            <button
              onClick={closeModal}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {addModalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md text-center">
            <h2 className="text-xl mb-4">Thêm đề thi mới</h2>
            <div className="mb-4">
              <label className="block text-left mb-2">Tiêu đề</label>
              <input
                type="text"
                value={newExam.title}
                onChange={(e) =>
                  setNewExam((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2">Mô tả</label>
              <input
                type="text"
                value={newExam.description}
                onChange={(e) =>
                  setNewExam((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2">Thời gian (phút)</label>
              <input
                type="number"
                value={newExam.duration}
                onChange={(e) =>
                  setNewExam((prev) => ({
                    ...prev,
                    duration: +e.target.value,
                  }))
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2">Môn thi</label>
              <select
                value={newExam.examSubjectId}
                onChange={(e) =>
                  setNewExam((prev) => ({
                    ...prev,
                    examSubjectId: +e.target.value,
                  }))
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              >
                <option value={0}>Chọn môn thi</option>
                {examSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddExam}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Thêm Đề Thi
            </button>
            <button
              onClick={closeModal}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {deleteModalIsOpen && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md text-center">
            <h2 className="text-xl mb-4">Xóa đề thi</h2>
            <p>Bạn có chắc chắn muốn xóa đề thi "{selectedExam.title}"?</p>
            <button
              onClick={handleDeleteExam}
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
            >
              Xóa
            </button>
            <button
              onClick={closeModal}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded mt-4"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
