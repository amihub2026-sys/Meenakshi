import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly http = inject(HttpClient);

  createOrder(payload: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/orders`,
      payload,
      {
        withCredentials: true
      }
    );
  }

  getMyOrders(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/orders/my`,
      {
        withCredentials: true
      }
    );
  }

  /* =====================================================
     CUSTOMER DOWNLOAD BILL
  ===================================================== */

  downloadBill(
    orderId: string
  ): Observable<Blob> {

    return this.http.get(
      `${environment.apiUrl}/orders/my/${orderId}/bill`,
      {
        withCredentials: true,
        responseType: 'blob'
      }
    );
  }

}