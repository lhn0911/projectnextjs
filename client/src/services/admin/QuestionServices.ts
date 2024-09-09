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
    return response.data;
  } catch (error) {
    throw new Error("Error fetching Questions");
  }
}

export async function addQuestion(newQuestion: Question) {
  try {
    await baseUrl.post("/questions", newQuestion);
  } catch (error) {
    throw new Error("Error adding Question");
  }
}

export async function deleteQuestion(id: number) {
  try {
    await baseUrl.delete(`/questions/${id}`);
  } catch (error) {
    throw new Error("Error deleting Question");
  }
}

export async function updateQuestion(updatedQuestion: Question) {
  try {
    await baseUrl.put(`/questions/${updatedQuestion.id}`, updatedQuestion);
  } catch (error) {
    throw new Error("Error updating Question");
  }
}
