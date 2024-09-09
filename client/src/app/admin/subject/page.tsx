"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import {
  getSubject,
  deleteSubject,
  addSubject,
  updateSubject,
} from "@/services/admin/SubjectServices";

interface Subject {
  id: number;
  title: string;
  description: string;
  coursesId: number;
  img: string;
}

export default function Subject() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
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

  useEffect(() => {
    fetchSubjects();
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
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (editSubject) {
      setEditSubject({
        ...editSubject,
        [e.target.name]: e.target.value,
      });
    }
    if (
      e.target.name === "title" ||
      e.target.name === "description" ||
      e.target.name === "img"
    ) {
      setNewSubject({
        ...newSubject,
        [e.target.name]: e.target.value,
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

      {detailModalIsOpen && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-2xl mb-4">{selectedSubject.title}</h2>
            {selectedSubject.img ? (
              <img
                src={selectedSubject.img}
                alt={selectedSubject.title}
                className="w-full h-64 object-cover mb-4"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center mb-4">
                No Image
              </div>
            )}
            <p>{selectedSubject.description}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(selectedSubject)}
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

      {deleteModalIsOpen && selectedSubject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md w-1/3">
            <h2 className="text-xl mb-4">Xóa khóa học</h2>
            <p>Bạn có chắc chắn muốn xóa khóa học {selectedSubject.title}?</p>
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
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {editModalIsOpen && editSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-2xl mb-4">Chỉnh sửa khóa học</h2>
            <form onSubmit={handleUpdateSubject}>
              <div className="mb-4">
                <label className="block mb-2">Tiêu đề</label>
                <input
                  type="text"
                  value={editSubject.title}
                  onChange={(e) =>
                    setEditSubject({ ...editSubject, title: e.target.value })
                  }
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Mô tả</label>
                <textarea
                  value={editSubject.description}
                  onChange={(e) =>
                    setEditSubject({
                      ...editSubject,
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
                  value={editSubject.img}
                  onChange={(e) =>
                    setEditSubject({ ...editSubject, img: e.target.value })
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
            <form onSubmit={handleAddSubject}>
              <div className="mb-4">
                <label className="block mb-2">Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={newSubject.title}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, title: e.target.value })
                  }
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Mô tả</label>
                <textarea
                  name="description"
                  value={newSubject.description}
                  onChange={(e) =>
                    setNewSubject({
                      ...newSubject,
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
                  name="img"
                  value={newSubject.img}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, img: e.target.value })
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
