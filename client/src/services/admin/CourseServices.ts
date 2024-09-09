import baseUrl from '@/app/api/index';

interface Course {
  id: number;
  title: string;
  description: string;
  img: string;
}

export async function getCourses() {
  try {
    const response = await baseUrl.get("/courses");
    return response.data;
  } catch (error) {
    throw new Error('Error fetching courses');
  }
}

export async function addCourse(newCourse:any) {
  try {
    const response = await baseUrl.post("/courses", newCourse);
    return response.data;
  } catch (error) {
    throw new Error('Error adding course');
  }
}

export async function deleteCourse(id: number) {
  try {
    await baseUrl.delete(`/courses/${id}`);
  } catch (error) {
    throw new Error('Error deleting course');
  }
}

export async function updateCourse(updatedCourse: Course) {
  try {
    await baseUrl.put(`/courses/${updatedCourse.id}`, updatedCourse);
  } catch (error) {
    throw new Error('Error updating course');
  }
}