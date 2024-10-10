import baseUrl from "@/app/api";

interface Question {
  id: number;
  questions: string;
  examId: number;
  options: string[];
  answer: string;
}

export async function getQuestions() {
  try {
    const response = await baseUrl.get("/questions");
    return response.data; // Trả về dữ liệu từ response
  } catch (error) {
    // Xử lý lỗi cụ thể và ném ra thông báo lỗi
    console.error("Error fetching questions:", error);
    throw new Error("Error fetching questions. Please try again later.");
  }
}

export async function addQuestion(newQuestion: Question) {
  try {
    const response = await baseUrl.post("/questions", newQuestion);
    return response.data; // Trả về dữ liệu câu hỏi mới đã được thêm
  } catch (error) {
    console.error("Error adding question:", error);
    throw new Error("Error adding question. Please try again later.");
  }
}

export async function deleteQuestion(id: number) {
  try {
    await baseUrl.delete(`/questions/${id}`);
  } catch (error) {
    console.error("Error deleting question:", error);
    throw new Error("Error deleting question. Please try again later.");
  }
}

export async function updateQuestion(updatedQuestion: Question) {
  try {
    const response = await baseUrl.put(`/questions/${updatedQuestion.id}`, updatedQuestion);
    return response.data; // Trả về dữ liệu câu hỏi đã được cập nhật
  } catch (error) {
    console.error("Error updating question:", error);
    throw new Error("Error updating question. Please try again later.");
  }
}
export async function getExams() {
  try {
      const response = await baseUrl.get("/exams");
      return response.data;
  } catch (error) {
      throw new Error('Error fetching Exam');
  }
}