import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private apiUrl = 'http://localhost:5000/api/categories';

  constructor(
    private http: HttpClient
  ) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  createCategory(data: Category): Observable<Category> {
    return this.http.post<Category>(
      this.apiUrl,
      data
    );
  }

  updateCategory(
    id: string,
    data: Category
  ): Observable<Category> {
    return this.http.put<Category>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}