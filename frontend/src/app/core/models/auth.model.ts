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
    requiresTwoFactor?: boolean;
    token?: string;
    tempToken?: string;
    user: User;
  };
}

export interface TwoFactorSetupResponse {
  status: 'success';
  message: string;
  data: {
    secret: string;
    otpauthUrl: string;
    qrCodeDataUrl: string;
  };
}

export interface TwoFactorVerifyPayload {
  tempToken?: string;
  code: string;
}

export interface TwoFactorVerifyResponse {
  status: 'success';
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface TwoFactorActionResponse {
  status: 'success';
  message: string;
  data: {
    user: User;
  };
}
