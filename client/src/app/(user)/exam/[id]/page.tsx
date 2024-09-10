"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/app/layout/header/Header";
import { getExamById, submitExam } from "@/services/user/ExamServices"; // Import dịch vụ mới
import { checkAnswers } from "@/services/user/ExamServices"; // Dịch vụ check câu trả lời

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
}

export default function ExamDetail() {
  const [exam, setExam] = useState<Exam | null>(null);
  const [history, setHistory] = useState<History[]>([]); // Lưu trữ lịch sử làm bài
  const [answers, setAnswers] = useState<string[]>([]); // Câu trả lời của người dùng
  const [score, setScore] = useState<number | null>(null); // Điểm của bài thi
  const [isSubmitted, setIsSubmitted] = useState(false); // Kiểm tra xem đã nộp bài chưa

  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchExam = async () => {
        const response = await getExamById(parseInt(id as string));
        setExam(response);
      };
      fetchExam();
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!exam) return;

    const userScore = checkAnswers(exam.questions || [], answers); // Kiểm tra đúng sai
    setScore(userScore);

    const historyItem = {
      examId: exam.id,
      score: userScore,
      date: new Date().toLocaleString(),
    };

    // Lưu kết quả làm bài vào lịch sử
    setHistory([...history, historyItem]);
    setIsSubmitted(true);

    // Gửi dữ liệu lên server hoặc local storage
    await submitExam(historyItem);

    // Điều hướng trở lại trang chi tiết đề thi
    router.push(`/exam/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto py-8">
        {exam ? (
          <>
            <h1 className="text-3xl font-bold">{exam.title}</h1>
            <p className="my-4">{exam.description}</p>
            <p>Thời gian: {exam.duration} phút</p>

            {/* Hiển thị câu hỏi */}
            {!isSubmitted &&
              exam.questions?.map((question, index) => (
                <div key={question.id}>
                  <h3 className="font-bold">{`Câu ${index + 1}: ${
                    question.questions
                  }`}</h3>
                  {question.options.map((option, i) => (
                    <label key={i}>
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
                      />
                      {option}
                    </label>
                  ))}
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

            {/* Hiển thị lịch sử làm bài */}
            {isSubmitted && score !== null && (
              <div className="mt-6">
                <h2 className="text-2xl font-bold">Lịch sử làm bài</h2>
                <p>Điểm: {score}</p>
                <ul>
                  {history.map((item, index) => (
                    <li key={index}>
                      Lần {index + 1}: {item.date} - Điểm: {item.score}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        © 2024 Online Exam. All rights reserved.
      </footer>
    </div>
  );
}
