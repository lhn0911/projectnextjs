import baseUrl from "@/app/api";


interface Question {
  id: number;
  questions: string; 
  options: string[];
  answer: string; 
  examId: number; 
}

export async function getQuestionsByExamId(examId: number): Promise<Question[]> {
  try {
    const response = await baseUrl.get(`/questions`);
    return response.data.filter((question: Question) => question.examId === examId);
  } catch (error) {
    throw new Error("Error fetching questions");
  }
}

export const checkAnswers = (questions: Question[], answers: string[]): number => {
  let score = 0;

  questions.forEach((question, index) => {
    console.log(`Question: ${question.questions}, Selected: ${answers[index]}, Correct: ${question.answer}`); 
    if (question.answer === answers[index]) {
      score += 1; 
    }
  });

  return score; 
};

export const submitQuestion = async (historyItem: { questionId: number; score: number; date: string }) => {
  const history = JSON.parse(localStorage.getItem('questionHistory') || '[]');
  history.push(historyItem);
  localStorage.setItem('questionHistory', JSON.stringify(history));
};
