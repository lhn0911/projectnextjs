"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/services/admin/QuestionServices";

interface Question {
  id: number;
  questions: string;
  examId: number;
  options: string[];
  answer: string;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const fetchQuestions = async () => {
    try {
      const response = await getQuestions();
      setQuestions(response);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const filteredQuestions = questions
    .filter((question) =>
      question.questions.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.questions.localeCompare(b.questions);
      } else {
        return b.questions.localeCompare(a.questions);
      }
    });

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setEditModalIsOpen(true);
  };

  const handleAdd = () => {
    setAddModalIsOpen(true);
  };

  const handleDelQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setDeleteModalIsOpen(true);
  };

  const handleSaveChanges = async () => {
    if (selectedQuestion) {
      try {
        await updateQuestion(selectedQuestion);
        await fetchQuestions();
        setEditModalIsOpen(false);
      } catch (error) {
        console.error("Error updating question:", error);
      }
    }
  };

  const handleAddQuestion = async (newQuestion: Question) => {
    try {
      await addQuestion(newQuestion);
      await fetchQuestions();
      setAddModalIsOpen(false);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleDeleteQuestion = async () => {
    if (selectedQuestion) {
      try {
        await deleteQuestion(selectedQuestion.id);
        await fetchQuestions();
        setDeleteModalIsOpen(false);
      } catch (error) {
        console.error("Error deleting question:", error);
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
          placeholder="Tìm kiếm theo câu hỏi..."
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
          Thêm Câu Hỏi
        </button>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b text-center">Câu hỏi</th>
            <th className="py-2 px-4 border-b text-center">Khóa học ID</th>
            <th className="py-2 px-4 border-b text-center">Các tùy chọn</th>
            <th className="py-2 px-4 border-b text-center">Đáp án</th>
            <th className="py-2 px-4 border-b text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentQuestions.map((question) => (
            <tr key={question.id}>
              <td className="py-2 px-4 border-b text-center">{question.id}</td>
              <td className="py-2 px-4 border-b text-center">
                {question.questions}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {question.examId}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {question.options.join(", ")}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {question.answer}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => handleEdit(question)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelQuestion(question)}
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
          { length: Math.ceil(filteredQuestions.length / questionsPerPage) },
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

      {editModalIsOpen && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md text-center">
            <h2 className="text-xl mb-4">Chỉnh sửa câu hỏi</h2>
            <div className="mb-4">
              <label className="block text-left mb-2">Câu hỏi</label>
              <input
                type="text"
                value={selectedQuestion.questions || ""}
                onChange={(e) =>
                  setSelectedQuestion(
                    (prev) => prev && { ...prev, question: e.target.value }
                  )
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2">Đáp án</label>
              <input
                type="text"
                value={selectedQuestion.answer || ""}
                onChange={(e) =>
                  setSelectedQuestion(
                    (prev) => prev && { ...prev, answer: e.target.value }
                  )
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2">Tùy chọn</label>
              <input
                type="text"
                value={selectedQuestion.options.join(", ")}
                onChange={(e) =>
                  setSelectedQuestion(
                    (prev) =>
                      prev && {
                        ...prev,
                        options: e.target.value.split(", "),
                      }
                  )
                }
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Lưu
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {addModalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md text-center">
            <h2 className="text-xl mb-4">Thêm câu hỏi mới</h2>
            {/* Tương tự như phần chỉnh sửa, thêm các trường nhập liệu cho việc thêm câu hỏi */}
            <button
              onClick={() =>
                handleAddQuestion({
                  id: Date.now(),
                  questions: "Câu hỏi mới",
                  examId: 1,
                  options: ["A", "B", "C", "D"],
                  answer: "A",
                })
              }
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Thêm
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {deleteModalIsOpen && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md text-center">
            <h2 className="text-xl mb-4">Xóa câu hỏi</h2>
            <p>
              Bạn có chắc muốn xóa câu hỏi:{" "}
              <strong>{selectedQuestion.questions}</strong> không?
            </p>
            <button
              onClick={handleDeleteQuestion}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              Xóa
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
