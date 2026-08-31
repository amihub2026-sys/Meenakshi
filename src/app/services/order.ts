import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface CustomerOrder {
  _id: string;

  customerName: string;
  phone: string;
  email: string;
  address: string;

  productId: string;
  productName: string;
  productImage: string;

  price: number;
  quantity: number;
  total: number;

  status: OrderStatus;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderData {
  customerName: string;
  phone: string;
  email: string;
  address: string;

  productId: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly apiUrl =
    'http://localhost:5000/api/orders';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token =
      localStorage.getItem('admin_token') || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Public customer checkout
  createOrder(
    orderData: CreateOrderData
  ): Observable<CustomerOrder> {
    return this.http.post<CustomerOrder>(
      this.apiUrl,
      orderData
    );
  }

  // Admin: get every customer order
  getAdminOrders(): Observable<CustomerOrder[]> {
    return this.http.get<CustomerOrder[]>(
      `${this.apiUrl}/admin/all`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Admin: update order status
  updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): Observable<CustomerOrder> {
    return this.http.patch<CustomerOrder>(
      `${this.apiUrl}/${orderId}/status`,
      { status },
      { headers: this.getAuthHeaders() }
    );
  }

  // Admin: permanently delete order
  deleteOrder(
    orderId: string
  ): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${orderId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}