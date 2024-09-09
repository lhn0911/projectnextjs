"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import {
  getCourses,
  deleteCourse,
  addCourse,
  updateCourse,
} from "@/services/admin/CourseServices";

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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [detailModalIsOpen, setDetailModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Course>({
    id: 0,
    title: "",
    description: "",
    img: "",
  });

  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
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

  const handleDetails = (course: Course) => {
    setSelectedCourse(course);
    setDetailModalIsOpen(true);
    setEditModalIsOpen(false);
  };

  const handleEdit = (course: Course) => {
    setEditCourse(course);
    setEditModalIsOpen(true);
    setDetailModalIsOpen(false);
  };

  const handleDelete = (course: Course) => {
    setSelectedCourse(course);
    setDeleteModalIsOpen(true);
  };

  const handleDeleteCourse = async () => {
    if (selectedCourse) {
      try {
        await deleteCourse(selectedCourse.id);
        await fetchCourses();
        setDeleteModalIsOpen(false);
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  const handleUpdateCourse = async (e: any) => {
    e.preventDefault();
    if (editCourse) {
      try {
        await updateCourse(editCourse);
        await fetchCourses();
        setEditModalIsOpen(false);
      } catch (error) {
        console.error("Error updating course:", error);
      }
    }
  };

  const handleAddCourse = async (e: any) => {
    e.preventDefault();
    try {
      await addCourse(newCourse);
      await fetchCourses();
      setAddModalIsOpen(false);
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleInputChange = (e: any) => {
    if (editCourse) {
      setEditCourse({
        ...editCourse,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleCloseModal = () => {
    setDetailModalIsOpen(false);
    setDeleteModalIsOpen(false);
    setEditModalIsOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
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
          <button
            onClick={() => setAddModalIsOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Thêm khóa luyện thi
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
              <button
                onClick={() => handleDetails(course)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Chi tiết
              </button>
              <button
                onClick={() => handleDelete(course)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Xóa
              </button>
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

      {detailModalIsOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-2xl mb-4">{selectedCourse.title}</h2>
            {selectedCourse.img ? (
              <img
                src={selectedCourse.img}
                alt={selectedCourse.title}
                className="w-full h-64 object-cover mb-4"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center mb-4">
                No Image
              </div>
            )}
            <p>{selectedCourse.description}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(selectedCourse)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Sửa
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalIsOpen && selectedCourse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md w-1/3">
            <h2 className="text-xl mb-4">Xóa khóa học</h2>
            <p>Bạn có chắc chắn muốn xóa khóa học {selectedCourse.title}?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDeleteCourse}
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

      {editModalIsOpen && editCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-2xl mb-4">Chỉnh sửa khóa học</h2>
            <form onSubmit={handleUpdateCourse}>
              <div className="mb-4">
                <label className="block mb-2">Tiêu đề</label>
                <input
                  type="text"
                  value={editCourse.title}
                  onChange={(e) =>
                    setEditCourse({ ...editCourse, title: e.target.value })
                  }
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Mô tả</label>
                <textarea
                  value={editCourse.description}
                  onChange={(e) =>
                    setEditCourse({
                      ...editCourse,
                      description: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Ảnh (URL)</label>
                <input
                  type="text"
                  value={editCourse.img}
                  onChange={(e) =>
                    setEditCourse({ ...editCourse, img: e.target.value })
                  }
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Lưu
                </button>
                <button
                  onClick={() => setEditModalIsOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {addModalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-2xl mb-4">Thêm khóa học</h2>
            <form onSubmit={handleAddCourse}>
              <div className="mb-4">
                <label className="block mb-2">Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Mô tả</label>
                <textarea
                  name="description"
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Ảnh (URL)</label>
                <input
                  type="text"
                  name="img"
                  value={newCourse.img}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, img: e.target.value })
                  }
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setAddModalIsOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
