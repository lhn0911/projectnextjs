"use client";
import { useRouter, useParams } from "next/navigation";
import Header from "@/app/layout/header/Header"; // Import Header layout
import { getSubjectById } from "@/services/user/SubjectServices"; // Import hàm lấy dữ liệu môn học theo id
import { useEffect, useState } from "react";
import Banner from "@/app/layout/banner/Banner";
interface Subject {
  id: number;
  title: string;
  description: string;
  coursesId: number;
  img: string;
  post: string[];
}

export default function SubjectDetail() {
  const [subject, setSubject] = useState<Subject | null>(null);
  const router = useRouter();
  const { id } = useParams(); // Lấy ID từ URL params

  useEffect(() => {
    if (id) {
      const fetchSubject = async () => {
        try {
          const response = await getSubjectById(parseInt(id as string));
          setSubject(response);
        } catch (error) {
          console.error("Error fetching subject:", error);
        }
      };
      fetchSubject();
    }
  }, [id]);

  if (!subject) {
    return <div>Không tìm thấy môn học.</div>;
  }

  return (
    <>
      {/* Header */}
      <Header />
      <Banner />
      {/* Main Content */}
      <main className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            {subject.title}
          </h1>

          <div className="flex justify-center mb-8">
            <img
              src={subject.img}
              alt={subject.title}
              className="w-full h-96 object-cover"
            />
          </div>

          <div className="p-4 bg-white rounded-lg shadow-lg">
            <p className="text-lg mb-4">{subject.description}</p>
            <h2 className="text-2xl font-bold mb-4">Các bài học</h2>
            <ul className="list-disc pl-5">
              {subject.post.map((lesson, index) => (
                <li key={index} className="mb-2">
                  {lesson}
                </li>
              ))}
            </ul>

            <button
              onClick={() => router.push(`/exam/${subject.id}`)}
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Làm đề thi
            </button>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        © 2024 Online Exam. All rights reserved.
      </footer>
    </>
  );
}
