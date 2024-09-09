
import baseUrl from '@/app/api/index';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role:number;
  profilePicture: string;
  status:number;

}

export async function getUsers() {
  try {
    const response = await baseUrl.get("/users");
    return response.data;
  } catch (error) {
    throw new Error('Error fetching users');
  }
}


export async function deleteUser(id: number){
  try {
    await baseUrl.delete(`/users/${id}`);
  } catch (error) {
    throw new Error('Error deleting user');
  }
}

export async function updateUser(updatedUser: User){
  try {
    await baseUrl.put(`/users/${updatedUser.id}`, updatedUser);
  } catch (error) {
    throw new Error('Error updating user');
  }
}
