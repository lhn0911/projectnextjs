import baseUrl from "@/app/api";
interface Subject {
    id: number,
    title: string,
    description: string,
    coursesId: number,
    img: string
}
export async function getSubjectById(id:number){
    try {
      const response = await baseUrl.get(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching Exam');
    }
  }