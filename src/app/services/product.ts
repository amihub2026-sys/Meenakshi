import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductName {
  en: string;
  ta: string;
  hi: string;
}

export interface Product {
  _id: string;
  name: ProductName;
  price: number;
  imageUrl: string;
  imageKey: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin_token') || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Public page: returns only enabled products
  getActiveProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Admin page: returns enabled and disabled products
  getAdminProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/admin/all`,
      { headers: this.getAuthHeaders() }
    );
  }

  addProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(
      this.apiUrl,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  updateProduct(
    productId: string,
    formData: FormData
  ): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiUrl}/${productId}`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  changeProductStatus(
    productId: string,
    isActive: boolean
  ): Observable<Product> {
    return this.http.patch<Product>(
      `${this.apiUrl}/${productId}/status`,
      { isActive },
      { headers: this.getAuthHeaders() }
    );
  }

  deleteProduct(productId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${productId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Public: get active products
getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(
    this.apiUrl
  );
}
}