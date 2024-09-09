"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import {
  getExam,
  addExam,
  updateExam,
  deleteExam,
} from "@/services/admin/ExamServices";

interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  examSubjectId: number;
}
export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [examsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

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

  const filteredExams = exams
    .filter((exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleEdit = (exam: Exam) => {
    setSelectedExam(exam);
    setEditModalIsOpen(true);
  };

  const handleAdd = () => {
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

  const handleAddExam = async (newExam: Exam) => {
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
            <th className="py-2 px-4 border-b text-center">Ảnh</th>
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
                {exam.coursesId}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <img src={exam.img} alt={exam.title} width="50" />
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
              <label className="block text-left mb-2">Khóa học ID</label>
              <input
                type="number"
                value={selectedExam.coursesId || ""}
                onChange={(e) =>
                  setSelectedExam(
                    (prev) => prev && { ...prev, coursesId: +e.target.value }
                  )
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2">Ảnh</label>
              <input
                type="text"
                value={selectedExam.img || ""}
                onChange={(e) =>
                  setSelectedExam(
                    (prev) => prev && { ...prev, img: e.target.value }
                  )
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Lưu
            </button>
            <button
              onClick={closeModal}
              className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-md"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {addModalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md text-center">
            <h2 className="text-xl mb-4">Thêm đề thi</h2>
            <div className="mb-4">
              <label className="block text-left mb-2">Tiêu đề</label>
              <input
                type="text"
                value={selectedExam?.title || ""}
                onChange={(e) =>
                  setSelectedExam({ ...selectedExam, title: e.target.value })
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2">Mô tả</label>
              <input
                type="text"
                value={selectedExam?.description || ""}
                onChange={(e) =>
                  setSelectedExam({
                    ...selectedExam,
                    description: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2">Khóa học ID</label>
              <input
                type="number"
                value={selectedExam?.coursesId || ""}
                onChange={(e) =>
                  setSelectedExam({
                    ...selectedExam,
                    coursesId: +e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2">Ảnh</label>
              <input
                type="text"
                value={selectedExam?.img || ""}
                onChange={(e) =>
                  setSelectedExam({
                    ...selectedExam,
                    img: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <button
              onClick={() => handleAddExam(selectedExam as Exam)}
              className="bg-green-500 text-white py-2 px-4 rounded-md"
            >
              Thêm
            </button>
            <button
              onClick={closeModal}
              className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-md"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {deleteModalIsOpen && selectedExam && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md w-1/3">
            <h2 className="text-xl mb-4">Xóa đề thi</h2>
            <p>Bạn có chắc chắn muốn xóa đề thi {selectedExam.title}?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDeleteExam}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Xóa
              </button>
              <button
                onClick={() => setDeleteModalIsOpen(false)}
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
}
