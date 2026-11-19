import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
export interface Category {
  _id?: string;

  name: {
    en: string;
    ta: string;
    hi: string;
  };

  imageUrl?: string;
  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

private apiUrl = 'https://meenakshi-backend.onrender.com/api/categories';

  constructor(
    private http: HttpClient
  ) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
private getAdminHeaders(): HttpHeaders {
  const token = localStorage.getItem('admin_token');

  return new HttpHeaders({
    Authorization: `Bearer ${token || ''}`
  });
}
createCategory(
  formData: FormData
): Observable<Category> {
  return this.http.post<Category>(
    this.apiUrl,
    formData,
    {
      headers: this.getAdminHeaders()
    }
  );
}

updateCategory(
  id: string,
  formData: FormData
): Observable<Category> {
  return this.http.put<Category>(
    `${this.apiUrl}/${id}`,
    formData,
    {
      headers: this.getAdminHeaders()
    }
  );
}

deleteCategory(id: string): Observable<any> {
  return this.http.delete(
    `${this.apiUrl}/${id}`,
    {
      headers: this.getAdminHeaders()
    }
  );
}
}