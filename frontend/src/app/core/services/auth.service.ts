import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  TwoFactorActionResponse,
  TwoFactorSetupResponse,
  TwoFactorVerifyResponse,
  User
} from '../models/auth.model';

const TOKEN_STORAGE_KEY = 'meditrack_jwt_token';
const USER_STORAGE_KEY = 'meditrack_current_user';
const PENDING_2FA_TOKEN_KEY = 'meditrack_pending_2fa_token';
const PENDING_2FA_USER_KEY = 'meditrack_pending_2fa_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly currentUserSubject = new BehaviorSubject<User | null>(this.loadStoredUser());
  readonly currentUser$ = this.currentUserSubject.asObservable();

  register(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, payload);
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((res) => {
        if (res?.data?.requiresTwoFactor && res?.data?.tempToken && res?.data?.user) {
          this.savePendingTwoFactor(res.data.tempToken, res.data.user);
        } else if (res?.data?.token && res?.data?.user) {
          this.clearPendingTwoFactor();
          this.saveSession(res.data.token, res.data.user);
        }
      })
    );
  }

  setupTwoFactor(): Observable<TwoFactorSetupResponse> {
    return this.http.post<TwoFactorSetupResponse>(`${this.apiUrl}/2fa/setup`, {});
  }

  enableTwoFactor(code: string): Observable<TwoFactorActionResponse> {
    return this.http.post<TwoFactorActionResponse>(`${this.apiUrl}/2fa/enable`, { code }).pipe(
      tap((res) => {
        if (res?.data?.user) {
          this.updateStoredUser(res.data.user);
        }
      })
    );
  }

  disableTwoFactor(code: string): Observable<TwoFactorActionResponse> {
    return this.http.post<TwoFactorActionResponse>(`${this.apiUrl}/2fa/disable`, { code }).pipe(
      tap((res) => {
        if (res?.data?.user) {
          this.updateStoredUser(res.data.user);
        }
      })
    );
  }

  verifyTwoFactor(code: string, tempToken?: string): Observable<TwoFactorVerifyResponse> {
    const tokenToUse = tempToken || this.getPendingTwoFactorToken() || '';
    return this.http
      .post<TwoFactorVerifyResponse>(`${this.apiUrl}/2fa/verify`, {
        tempToken: tokenToUse,
        code
      })
      .pipe(
        tap((res) => {
          if (res?.data?.token && res?.data?.user) {
            this.clearPendingTwoFactor();
            this.saveSession(res.data.token, res.data.user);
          }
        })
      );
  }

  fetchMe(): Observable<{ status: 'success'; data: { user: User } }> {
    return this.http.get<{ status: 'success'; data: { user: User } }>(`${this.apiUrl}/me`).pipe(
      tap((res) => {
        if (res?.data?.user) {
          this.updateStoredUser(res.data.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    this.clearPendingTwoFactor();
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  getPendingTwoFactorToken(): string | null {
    return sessionStorage.getItem(PENDING_2FA_TOKEN_KEY);
  }

  getPendingTwoFactorUser(): User | null {
    try {
      const raw = sessionStorage.getItem(PENDING_2FA_USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  hasPendingTwoFactor(): boolean {
    return Boolean(this.getPendingTwoFactorToken());
  }

  clearPendingTwoFactor(): void {
    sessionStorage.removeItem(PENDING_2FA_TOKEN_KEY);
    sessionStorage.removeItem(PENDING_2FA_USER_KEY);
  }

  private savePendingTwoFactor(tempToken: string, user: User): void {
    sessionStorage.setItem(PENDING_2FA_TOKEN_KEY, tempToken);
    sessionStorage.setItem(PENDING_2FA_USER_KEY, JSON.stringify(user));
  }

  private saveSession(token: string, user: User): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    this.updateStoredUser(user);
  }

  private updateStoredUser(user: User): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
