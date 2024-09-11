
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
export async function createUser(user: User){
    try {
      await baseUrl.post("/users", user);
    } catch (error) {
      throw new Error('Error creating user');
    }
  }

  export async function getUserById(id:number){
    try {
      const response = await baseUrl.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching user');
    }
  }
  export async function updateUser(updatedUser: User){
    try {
      await baseUrl.put(`/users/${updatedUser.id}`, updatedUser);
    } catch (error) {
      throw new Error('Error updating user');
    }
  }
  