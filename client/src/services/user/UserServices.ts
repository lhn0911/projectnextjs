
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