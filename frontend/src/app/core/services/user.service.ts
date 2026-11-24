import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User, UserRole } from '../models/auth.model';

export interface StaffUser extends User {
  specialite?: string;
  createdAt?: string;
}

export interface CreateStaffPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  specialite?: string;
}

export interface UsersListResponse {
  status: 'success';
  data: {
    users: StaffUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  listUsers(filters?: { role?: string; search?: string }): Observable<UsersListResponse> {
    let params = new HttpParams();
    if (filters?.role) params = params.set('role', filters.role);
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<UsersListResponse>(this.apiUrl, { params });
  }

  createUser(payload: CreateStaffPayload): Observable<{ status: 'success'; message: string; data: { user: StaffUser } }> {
    return this.http.post<{ status: 'success'; message: string; data: { user: StaffUser } }>(
      this.apiUrl,
      payload
    );
  }

  updateUser(
    id: string,
    payload: Partial<CreateStaffPayload>
  ): Observable<{ status: 'success'; message: string; data: { user: StaffUser } }> {
    return this.http.put<{ status: 'success'; message: string; data: { user: StaffUser } }>(
      `${this.apiUrl}/${id}`,
      payload
    );
  }

  setUserStatus(
    id: string,
    isActive: boolean
  ): Observable<{ status: 'success'; message: string; data: { user: StaffUser } }> {
    return this.http.patch<{ status: 'success'; message: string; data: { user: StaffUser } }>(
      `${this.apiUrl}/${id}/status`,
      { isActive }
    );
  }

  deleteUser(id: string): Observable<{ status: 'success'; message: string }> {
    return this.http.delete<{ status: 'success'; message: string }>(`${this.apiUrl}/${id}`);
  }
}
