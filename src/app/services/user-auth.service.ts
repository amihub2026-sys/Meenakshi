import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface GoogleLoginResponse {
  success: boolean;
  message: string;
  token: string;

  user: {
    id: string;
    name: string;
    email: string;
    picture: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private readonly http = inject(HttpClient);
  getCurrentUser(): Observable<CurrentUserResponse> {
  return this.http.get<CurrentUserResponse>(
    `${environment.apiUrl}/user-auth/me`,
    {
      withCredentials: true
    }
  );
}
 logout(): Observable<{ success: boolean }> {
  return this.http.post<{ success: boolean }>(
    `${environment.apiUrl}/user-auth/logout`,
    {},
    {
      withCredentials: true
    }
  );
}
 googleLogin(
  credential: string
): Observable<GoogleLoginResponse> {
  return this.http.post<GoogleLoginResponse>(
    `${environment.apiUrl}/user-auth/google`,
    {
      credential
    },
    {
      withCredentials: true
    }
  );
}
  
}

export interface CurrentUserResponse {
  success: boolean;

  user: {
    id: string;
    name: string;
    email: string;
    picture: string;
    provider: string;
    lastLoginAt: string | null;
  };
 
}