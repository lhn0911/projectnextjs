import baseUrl from "@/app/api";

interface Exam {
    id: number;
    title: string;
    description: string;
    duration: number;
    examSubjectId: number;
}

interface ExamSubject {
    id: number;
    name: string;
}

export async function getExam() {
    try {
        const response = await baseUrl.get("/exams");
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Exam');
    }
}

export async function addExam(newExam: Exam) {
    try {
        await baseUrl.post("/exams", newExam);
    } catch (error) {
        throw new Error('Error adding Exam');
    }
}

export async function deleteExam(id: number) {
    try {
        await baseUrl.delete(`/exams/${id}`);
    } catch (error) {
        throw new Error('Error deleting Exam');
    }
}

export async function updateExam(updateExam: Exam) {
    try {
        await baseUrl.put(`/exams/${updateExam.id}`, updateExam);
    } catch (error) {
        throw new Error('Error updating Exam');
    }
}

export async function getExamSubjects() {
    try {
        const response = await baseUrl.get("/subjects");
        return response.data;
    } catch (error) {
        console.error(error); 
        throw new Error('Error fetching Exam Subjects');
    }
}
