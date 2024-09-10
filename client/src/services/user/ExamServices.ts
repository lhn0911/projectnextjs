import baseUrl from "@/app/api";
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
  
export async function getExamById(id:number){
  try {
    const response = await baseUrl.get(`/exams/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching Exam');
  }
}
export const checkAnswers = (questions: Question[], answers: string[]): number => {
  let score = 0;
  questions.forEach((question, index) => {
    if (question.answer === answers[index]) {
      score += 1; // Mỗi câu đúng được 1 điểm
    }
  });
  return score;
};
// Giả lập việc lưu kết quả làm bài lên server hoặc localStorage
export const submitExam = async (historyItem: { examId: number; score: number; date: string }) => {
  const history = JSON.parse(localStorage.getItem('examHistory') || '[]');
  history.push(historyItem);
  localStorage.setItem('examHistory', JSON.stringify(history));
};
