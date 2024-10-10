import baseUrl from "@/app/api";

interface Question {
  id: number;
  questions: string; 
  answer: string;
  examId: number;
}

export interface Subject {
  id: number;
  title: string;
  description: string;
  coursesId: number; 
  img: string;
  post: string[];
}

export interface Course {
  id: number;
  description: string;
  title: string; 
  img: string;
  subjects?: Subject[];
}

export async function getCoursesWithSubjects(): Promise<Course[]> {
  try {
    const [coursesResponse, subjectsResponse] = await Promise.all([
      baseUrl.get("/courses"),
      baseUrl.get("/subjects"),
    ]);

    const courses: Course[] = coursesResponse.data;
    const subjects: Subject[] = subjectsResponse.data;

    courses.forEach(course => {
      course.subjects = subjects.filter(subject => subject.coursesId === course.id);
    });

    return courses;
  } catch (error) {
    throw new Error('Error fetching courses with subjects');
  }
}

export async function getExamsBySubjectId(subjectId: number) {
  try {
    const response = await baseUrl.get("/exams");
    const exams = response.data.filter((exam: any) => exam.examSubjectId === subjectId);
    return exams;
  } catch (error) {
    throw new Error('Error fetching exams');
  }
}

export async function getQuestionsByExamId(examId: number): Promise<Question[]> {
  try {
    const response = await baseUrl.get("/questions");
    return response.data.filter((question: Question) => question.examId === examId);
  } catch (error) {
    throw new Error("Error fetching questions");
  }
}
