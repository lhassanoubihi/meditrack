export type UserRole = 'admin' | 'medecin' | 'infirmier' | 'patient' | 'pharmacien';

export interface User {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive?: boolean;
  twoFactorEnabled?: boolean;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  status: 'success';
  message: string;
  data: {
    user: User;
  };
}

export interface LoginResponse {
  status: 'success';
  message: string;
  data: {
    token: string;
    user: User;
  };
}
