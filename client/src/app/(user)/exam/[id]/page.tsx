"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getQuestionsByExamId,
  checkAnswers,
  submitQuestion,
} from "@/services/user/QuestionServices";

interface Question {
  id: number;
  questions: string;
  options: string[];
  answer: string;
  examId: number;
}

// Component chính cho trang câu hỏi
export default function QuestionPage() {
  const { id } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuestionPage, setCurrentQuestionPage] = useState(1);
  const itemsPerPage = 5;

  // Load lịch sử từ localStorage khi component được mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("examHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getQuestionsByExamId(Number(id));
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  const handleAnswerChange = (index: number, option: string) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = option;
      return updated;
    });
  };

  const handleSubmit = () => {
    const userScore = checkAnswers(questions, answers);
    setScore(userScore);
    const historyItem: any = {
      date: new Date().toLocaleString(),
      score: userScore,
    };

    // Cập nhật lịch sử và lưu vào localStorage
    const updatedHistory = [...history, historyItem];
    setHistory(updatedHistory);
    localStorage.setItem("examHistory", JSON.stringify(updatedHistory));

    submitQuestion(historyItem);
    setModalIsOpen(true);
  };

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  // Phân trang cho câu hỏi
  const indexOfLastQuestion = currentQuestionPage * itemsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - itemsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const totalQuestionPages = Math.ceil(questions.length / itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white py-4 text-center">
        <h1 className="text-2xl">Kỳ thi</h1>
      </header>
      <main className="flex-1 container mx-auto py-8">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">Danh sách câu hỏi</h1>
            {currentQuestions.map((question, index) => (
              <div key={question.id} className="mb-6">
                <h3 className="font-semibold text-lg mb-2">
                  {question.questions}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {question.options.map((option, i) => (
                    <label
                      key={i}
                      className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        onChange={() => handleAnswerChange(index, option)}
                        className="mr-3"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Nút chuyển trang cho câu hỏi */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() =>
                  setCurrentQuestionPage(
                    currentQuestionPage > 1
                      ? currentQuestionPage - 1
                      : currentQuestionPage
                  )
                }
                disabled={currentQuestionPage === 1}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                Trước
              </button>
              <span>
                Trang {currentQuestionPage} / {totalQuestionPages}
              </span>
              <button
                onClick={() =>
                  setCurrentQuestionPage(
                    currentQuestionPage < totalQuestionPages
                      ? currentQuestionPage + 1
                      : currentQuestionPage
                  )
                }
                disabled={currentQuestionPage === totalQuestionPages}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                Sau
              </button>
            </div>

            <button
              onClick={handleOpenModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
            >
              Xem lịch sử
            </button>

            <button
              onClick={handleSubmit}
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Nộp bài
            </button>
          </>
        )}

        {/* Modal hiển thị lịch sử */}
        {modalIsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md w-1/2">
              <h2 className="text-xl mb-4">Lịch sử làm bài</h2>
              <ul>
                {currentItems.length === 0 ? (
                  <li>Chưa có lịch sử làm bài</li>
                ) : (
                  currentItems.map((item, index) => (
                    <li key={index}>
                      Lần {index + 1 + (currentPage - 1) * itemsPerPage}: Ngày:{" "}
                      {item.date} - Điểm: {item.score}
                    </li>
                  ))
                )}
              </ul>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() =>
                    setCurrentPage(
                      currentPage > 1 ? currentPage - 1 : currentPage
                    )
                  }
                  disabled={currentPage === 1}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Trước
                </button>
                <span>
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(
                      currentPage < totalPages ? currentPage + 1 : currentPage
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Sau
                </button>
              </div>
              <button
                onClick={handleCloseModal}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center">
        © 2024 Online Exam. All rights reserved.
      </footer>
    </div>
  );
}
