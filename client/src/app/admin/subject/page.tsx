"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import {
  getSubject,
  deleteSubject,
  addSubject,
  updateSubject,
  getCourses,
} from "@/services/admin/SubjectServices";

interface Subject {
  id: number;
  title: string;
  description: string;
  coursesId: number;
  img: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
}

const SubjectDetailModal = ({ subject, courses, onClose, onEdit }: any) => {
  const associatedCourse = courses.find(
    (course: any) => course.id === subject.coursesId
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md w-2/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{subject.title}</h2>
        <div className="mb-4">
          {subject.img ? (
            <img
              src={subject.img}
              alt={subject.title}
              className="w-full h-64 object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md">
              No Image Available
            </div>
          )}
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Mô tả:</h3>
          <p>{subject.description}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Khóa học liên quan:</h3>
          {associatedCourse ? (
            <div>
              <p>
                <strong>Tên khóa học:</strong> {associatedCourse.title}
              </p>
              <p>
                <strong>Mô tả khóa học:</strong> {associatedCourse.description}
              </p>
            </div>
          ) : (
            <p>Không có thông tin về khóa học liên quan.</p>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => onEdit(subject)}
            className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
          >
            Sửa
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Subject() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [subjectsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [detailModalIsOpen, setDetailModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [newSubject, setNewSubject] = useState<Subject>({
    id: 0,
    title: "",
    description: "",
    coursesId: 0,
    img: "",
  });

  const fetchSubjects = async () => {
    try {
      const response = await getSubject();
      setSubjects(response);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchCourses();
  }, []);

  const filteredSubjects = subjects
    .filter(
      (subject) =>
        subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = filteredSubjects.slice(
    indexOfFirstSubject,
    indexOfLastSubject
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDetails = (subject: Subject) => {
    setSelectedSubject(subject);
    setDetailModalIsOpen(true);
    setEditModalIsOpen(false);
  };

  const handleEdit = (subject: Subject) => {
    setEditSubject(subject);
    setEditModalIsOpen(true);
    setDetailModalIsOpen(false);
  };

  const handleDelete = (subject: Subject) => {
    setSelectedSubject(subject);
    setDeleteModalIsOpen(true);
  };

  const handleDeleteSubject = async () => {
    if (selectedSubject) {
      try {
        await deleteSubject(selectedSubject.id);
        await fetchSubjects();
        setDeleteModalIsOpen(false);
      } catch (error) {
        console.error("Error deleting subject:", error);
      }
    }
  };

  const handleUpdateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editSubject) {
      try {
        await updateSubject(editSubject);
        await fetchSubjects();
        setEditModalIsOpen(false);
      } catch (error) {
        console.error("Error updating subject:", error);
      }
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSubject(newSubject);
      await fetchSubjects();
      setAddModalIsOpen(false);
      setNewSubject({
        id: 0,
        title: "",
        description: "",
        coursesId: 0,
        img: "",
      });
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (editSubject) {
      setEditSubject({
        ...editSubject,
        [name]: name === "coursesId" ? parseInt(value) : value,
      });
    }
    if (
      name === "title" ||
      name === "description" ||
      name === "img" ||
      name === "coursesId"
    ) {
      setNewSubject({
        ...newSubject,
        [name]: name === "coursesId" ? parseInt(value) : value,
      });
    }
  };

  const handleCloseModal = () => {
    setDetailModalIsOpen(false);
    setDeleteModalIsOpen(false);
    setEditModalIsOpen(false);
    setAddModalIsOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm môn thi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
          onClick={() => setAddModalIsOpen(true)}
          className="ml-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Thêm môn thi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentSubjects.map((subject) => (
          <div key={subject.id} className="border rounded-lg p-4">
            {subject.img ? (
              <img
                src={subject.img}
                alt={subject.title}
                className="w-full h-48 object-cover mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-4">
                No Image
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">{subject.title}</h3>
            <p className="mb-4">{subject.description}</p>
            <div className="flex justify-between">
              <button
                onClick={() => handleDetails(subject)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Chi tiết
              </button>
              <button
                onClick={() => handleDelete(subject)}
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
          { length: Math.ceil(filteredSubjects.length / subjectsPerPage) },
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

      {/* Detail Modal */}
      {detailModalIsOpen && selectedSubject && (
        <SubjectDetailModal
          subject={selectedSubject}
          courses={courses}
          onClose={() => setDetailModalIsOpen(false)}
          onEdit={handleEdit}
        />
      )}

      {/* Edit Modal */}
      {editModalIsOpen && editSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-2xl mb-4">Chỉnh sửa môn thi</h2>
            <form onSubmit={handleUpdateSubject}>
              <div className="mb-4">
                <label className="block mb-2">Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={editSubject.title}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Mô tả</label>
                <textarea
                  name="description"
                  value={editSubject.description}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Ảnh (URL)</label>
                <input
                  type="text"
                  name="img"
                  value={editSubject.img}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                  placeholder="Đường dẫn ảnh"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Chọn khóa học</label>
                <select
                  name="coursesId"
                  value={editSubject.coursesId}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                  required
                >
                  <option value={0}>Chọn khóa học</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Lưu
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalIsOpen && selectedSubject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md w-1/3">
            <h2 className="text-xl mb-4">Xóa môn thi</h2>
            <p>Bạn có chắc chắn muốn xóa môn thi {selectedSubject.title}?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDeleteSubject}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Xóa
              </button>
              <button
                onClick={() => setDeleteModalIsOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {addModalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-2xl mb-4">Thêm môn thi</h2>
            <form onSubmit={handleAddSubject}>
              <div className="mb-4">
                <label className="block mb-2">Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={newSubject.title}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Mô tả</label>
                <textarea
                  name="description"
                  value={newSubject.description}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Ảnh (URL)</label>
                <input
                  type="text"
                  name="img"
                  value={newSubject.img}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                  placeholder="Đường dẫn ảnh"
                />
              </div>

              {/* Dropdown chọn khóa học */}
              <div className="mb-4">
                <label className="block mb-2">Chọn khóa học</label>
                <select
                  name="coursesId"
                  value={newSubject.coursesId}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                  required
                >
                  <option value={0}>Chọn khóa học</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Thêm
                </button>
                <button
                  onClick={handleCloseModal}
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
