"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/layout/header/Header";
import Banner from "@/app/layout/banner/Banner";
import { useRouter } from "next/navigation";
import { getCoursesWithSubjects, Course } from "@/services/user/CouseServices";
import Footer from "./layout/footer/Footer";

export default function Page() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCoursesWithSubjects();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (courseId: number) => {
    setSelectedCourseId(selectedCourseId === courseId ? null : courseId);
  };

  const handleSubjectClick = (subjectId: number) => {
    router.push(`/subject/${subjectId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Banner />
      <main className="flex-1 bg-gray-100 p-6">
        <h2 className="text-3xl font-bold mb-6">Trang web thi online</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="mb-6">
              <div
                className="block bg-white shadow-md rounded-lg p-6 text-center cursor-pointer hover:bg-gray-200 transition"
                onClick={() => handleCourseClick(course.id)}
              >
                <img
                  className="w-full h-40 object-cover mb-4"
                  src={course.img || "https://via.placeholder.com/300"}
                  alt={course.title}
                />
                <h3 className="text-xl font-semibold mb-4">{course.title}</h3>
                <p>{course.description}</p>
              </div>

              {selectedCourseId === course.id && course.subjects && (
                <div className="mt-4 p-4 bg-gray-200 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">
                    Danh sách môn thi:
                  </h4>
                  <ul>
                    {course.subjects.map((subject) => (
                      <li
                        key={subject.id}
                        className="p-2 cursor-pointer hover:bg-gray-300 transition"
                        onClick={() => handleSubjectClick(subject.id)}
                      >
                        {subject.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
}
