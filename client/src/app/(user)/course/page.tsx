"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import { getCourses } from "@/services/admin/CourseServices";
import Header from "@/app/layout/header/Header";
import Banner from "@/app/layout/banner/Banner";
interface Course {
  id: number;
  title: string;
  description: string;
  img: string;
}

export default function Course() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses
    .filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      {" "}
      <Header />
      <Banner></Banner>
      <main className="min-h-screen bg-gray-100 py-8">
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-4 mr-4"
          />
          <div className="flex space-x-4">
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center border border-gray-300 rounded-md py-2 px-4"
            >
              <FaSearch className="mr-2" />
              {sortOrder === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentCourses.map((course) => (
            <div key={course.id} className="border rounded-lg p-4">
              {course.img ? (
                <img
                  src={course.img}
                  alt={course.title}
                  className="w-full h-48 object-cover mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-4">
                  No Image
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="mb-4">{course.description}</p>
              <div className="flex justify-between">
                {/* Nút Chi tiết */}
                <a href={`/exam`}>
                  <a className="bg-blue-500 text-white px-4 py-2 rounded">
                    Chi tiết
                  </a>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          {Array.from(
            { length: Math.ceil(filteredCourses.length / coursesPerPage) },
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
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        © 2024 Online Exam. All rights reserved.
      </footer>
    </>
  );
}
