import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  message: string;
  token: string;
  admin?: {
    id: string;
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

private readonly apiUrl =
  `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(
    loginData: AdminLoginData
  ): Observable<AdminLoginResponse> {
    return this.http
      .post<AdminLoginResponse>(
        `${this.apiUrl}/login`,
        loginData
      )
      .pipe(
        tap(response => {
          localStorage.setItem(
            'admin_token',
            response.token
          );

          if (response.admin) {
            localStorage.setItem(
              'admin_user',
              JSON.stringify(response.admin)
            );
          }
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  getAdminUser(): AdminLoginResponse['admin'] | null {
    const admin = localStorage.getItem('admin_user');

    if (!admin) {
      return null;
    }

    try {
      return JSON.parse(admin);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return Boolean(this.getToken());
  }

  logout(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }
}