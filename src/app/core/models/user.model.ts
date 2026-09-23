export interface Company {
  department: string;
  name: string;
  title: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  age?: number;
  gender?: string;
  company?: Company;
}

export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}
