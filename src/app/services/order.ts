import {
  Injectable
} from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';


export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';


export interface OrderItem {
  productId: string;

  productName: string;
  productImage: string;

  price: number;
  quantity: number;
  lineTotal: number;
}


export interface CustomerOrder {
  _id: string;

  customerName: string;
  phone: string;

  email?: string;

  address: string;

  items: OrderItem[];

  total: number;

  status: OrderStatus;

  createdAt?: string;
  updatedAt?: string;
}


export interface CreateOrderItem {
  productId: string;
  quantity: number;
}


export interface CreateOrderData {
  customerName: string;
  phone: string;

  email?: string;

  address: string;

  items: CreateOrderItem[];
}


export interface CreateOrderResponse {
  message: string;
  order: CustomerOrder;
}


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly apiUrl =
    'http://localhost:5000/api/orders';


  constructor(
    private http: HttpClient
  ) {}


  private getAuthHeaders(): HttpHeaders {
    const token =
      localStorage.getItem('admin_token') || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }


  // Public: customer submits complete cart
  createOrder(
    orderData: CreateOrderData
  ): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(
      this.apiUrl,
      orderData
    );
  }


  // Admin: get every customer order
  getAdminOrders(): Observable<CustomerOrder[]> {
    return this.http.get<CustomerOrder[]>(
      `${this.apiUrl}/admin/all`,

      {
        headers: this.getAuthHeaders()
      }
    );
  }


  // Admin: update order status
  updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): Observable<CustomerOrder> {
    return this.http.patch<CustomerOrder>(
      `${this.apiUrl}/${orderId}/status`,

      {
        status
      },

      {
        headers: this.getAuthHeaders()
      }
    );
  }


  // Admin: permanently delete order
  deleteOrder(
    orderId: string
  ): Observable<{
    message: string;
  }> {
    return this.http.delete<{
      message: string;
    }>(
      `${this.apiUrl}/${orderId}`,

      {
        headers: this.getAuthHeaders()
      }
    );
  }
}