import baseUrl from "@/app/api";
interface Subject {
    id: number,
    title: string,
    description: string,
    coursesId: number,
    img: string
}
export async function getSubject(){
    try {
        const response = await baseUrl.get("/subjects");
        return response.data;
    } catch (error) {
        throw new Error('Error fetching subject');
    }
 
}
export async function addSubject(newSubject: Subject){
    try {
        await baseUrl.post("/subjects", newSubject);
    } catch (error) {
        throw new Error('Error adding subject');
    }
}
export async function deleteSubject(id:number){
    try {
        await baseUrl.delete(`/subjects/${id}`);
    } catch (error) {
        throw new Error('Error deleting subject');
    }
}
export async function updateSubject(updateSubject: Subject){
    try {
        await baseUrl.put(`/subjects/${updateSubject.id}`, updateSubject);
    } catch (error) {
        throw new Error('Error updating subject');
    }

}