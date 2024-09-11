"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/app/layout/header/Header";
import { getExamById, checkAnswers } from "@/services/user/ExamServices";
import Banner from "@/app/layout/banner/Banner";
interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  questions?: Question[];
}

interface Question {
  id: number;
  questions: string;
  options: string[];
  answer: string;
}

interface History {
  examId: number;
  score: number;
  date: string;
  attempts: number;
}

export default function ExamDetail() {
  const [exam, setExam] = useState<Exam | null>(null);
  const [history, setHistory] = useState<History[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [resultModalIsOpen, setResultModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [examsPerPage] = useState(5);

  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchExam = async () => {
        const response = await getExamById(parseInt(id as string));
        setExam(response);

        const savedHistory = JSON.parse(
          localStorage.getItem("examHistory") || "[]"
        );
        const currentExamHistory = savedHistory.filter(
          (item: History) => item.examId === parseInt(id as string)
        );
        setHistory(currentExamHistory);
      };
      fetchExam();
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!exam) return;

    const userScore = checkAnswers(exam.questions || [], answers);
    setScore(userScore);

    const historyItem = {
      examId: exam.id,
      score: userScore,
      date: new Date().toLocaleString(),
      attempts: history.length > 0 ? history[0].attempts + 1 : 1,
    };

    const updatedHistory = [...history, historyItem];
    setHistory(updatedHistory);
    setIsSubmitted(true);

    localStorage.setItem("examHistory", JSON.stringify(updatedHistory));

    // Hiển thị modal kết quả
    setResultModalIsOpen(true);
  };

  const handleRetake = async () => {
    if (!exam) return;

    setAnswers([]);
    setScore(null);
    setIsSubmitted(false);

    const userScore = checkAnswers(exam.questions || [], answers);
    const historyItem = {
      examId: exam.id,
      score: userScore,
      date: new Date().toLocaleString(),
      attempts: history.length > 0 ? history[0].attempts + 1 : 1,
    };

    const updatedHistory = [...history, historyItem];
    setHistory(updatedHistory);

    localStorage.setItem("examHistory", JSON.stringify(updatedHistory));
    router.push(`/exam/${id}`);
  };

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleCloseResultModal = () => {
    setResultModalIsOpen(false);
  };

  const indexOfLastHistory = currentPage * examsPerPage;
  const indexOfFirstHistory = indexOfLastHistory - examsPerPage;
  const currentHistory = history.slice(indexOfFirstHistory, indexOfLastHistory);

  const totalPages = Math.ceil(history.length / examsPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Banner />
      <main className="flex-1 container mx-auto py-8">
        {exam ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">{exam.title}</h1>
              <button
                onClick={handleOpenModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Xem lịch sử
              </button>
            </div>
            <p className="my-4">{exam.description}</p>
            <p>Thời gian: {exam.duration} phút</p>

            {/* Hiển thị câu hỏi */}
            {/* Hiển thị câu hỏi */}
            {!isSubmitted &&
              exam.questions?.map((question, index) => (
                <div key={question.id} className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">{`Câu ${
                    index + 1
                  }: ${question.questions}`}</h3>
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
                          onChange={() =>
                            setAnswers((prev) => {
                              const updated = [...prev];
                              updated[index] = option;
                              return updated;
                            })
                          }
                          className="mr-3"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

            {/* Nút nộp bài */}
            {!isSubmitted && (
              <button
                onClick={handleSubmit}
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Nộp bài
              </button>
            )}

            {/* Nút làm lại bài */}
            {isSubmitted && (
              <button
                onClick={handleRetake}
                className="mt-6 bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Làm lại bài
              </button>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </main>

      {/* Modal hiển thị lịch sử */}
      {modalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-1/2">
            <h2 className="text-xl mb-4">Lịch sử làm bài</h2>
            <ul>
              {currentHistory.length === 0 ? (
                <li>Chưa có lịch sử làm bài</li>
              ) : (
                currentHistory.map((item, index) => (
                  <li key={index}>
                    Lần {item.attempts}: {item.date} - Điểm: {item.score}
                  </li>
                ))
              )}
            </ul>
            <div className="mt-4 flex justify-center">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`mx-1 px-4 py-2 rounded-md ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
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

      {/* Modal thông báo điểm */}
      {resultModalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-1/2">
            <h2 className="text-xl mb-4">Kết quả bài làm</h2>
            <p className="text-lg">Điểm của bạn là: {score}</p>
            <button
              onClick={handleCloseResultModal}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      <footer className="bg-gray-800 text-white py-4 text-center">
        © 2024 Online Exam. All rights reserved.
      </footer>
    </div>
  );
}
