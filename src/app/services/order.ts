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

import {
  environment
} from '../../environments/environment';


/* =========================================================
   ORDER STATUS
========================================================= */
export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';


export type DeliveryType =
  | 'LOCAL'
  | 'DISTRICT'
  | 'STATE';


export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed';


export type PaymentMethod =
  | 'TEST'
  | 'COD'
  | 'RAZORPAY';



/* =========================================================
   SAVED ORDER ITEM
========================================================= */

export interface OrderItem {

  productId: string;

  productName: string;

  productNameTa?: string;

  productNameHi?: string;

  productImage: string;

  price: number;

  quantity: number;

  variantQuantity: number;

  variantUnit: string;

  lineTotal: number;
}



/* =========================================================
   CUSTOMER ORDER FROM BACKEND
========================================================= */

export interface CustomerOrder {

  _id: string;


  /* USER */

  userId?: string;


  /* CUSTOMER */

  customerName: string;

  phone: string;

  email?: string;


  /* DELIVERY ADDRESS */

  address: string;

  district: string;

  state: string;

  pincode: string;


  /* PRODUCTS */

  items: OrderItem[];


  /* AMOUNT */

  subtotal: number;

  deliveryType: DeliveryType;

  shippingWeight: number;

  deliveryCharge: number;

  total: number;


  /* PAYMENT */

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  paymentId?: string;


  /* ORDER */

  status: OrderStatus;


  createdAt?: string;

  updatedAt?: string;
}



/* =========================================================
   CREATE ORDER ITEM
========================================================= */

export interface CreateOrderItem {

  productId: string;

  quantity: number;


  /* REQUIRED FOR BACKEND VARIANT CHECK */

  variantQuantity: number;

  variantUnit: string;
}



/* =========================================================
   CREATE ORDER PAYLOAD
========================================================= */

export interface CreateOrderData {

  customerName: string;

  phone: string;

  email?: string;


  /* DELIVERY */

  address: string;

  district: string;

  state: string;

  pincode: string;


  /* CART */

  items: CreateOrderItem[];
}



/* =========================================================
   CREATE ORDER RESPONSE
========================================================= */

export interface CreateOrderResponse {

  success: boolean;

  message: string;

  order: CustomerOrder;
}



/* =========================================================
   MY ORDERS RESPONSE
========================================================= */

export interface MyOrdersResponse {

  success: boolean;

  orders: CustomerOrder[];
}



/* =========================================================
   MONTHLY SALES
========================================================= */

export interface MonthlySalesProduct {

  _id: string;

  productName: string;

  productImage?: string;

  totalQuantity: number;

  totalRevenue: number;
}


export interface MonthlySalesResponse {

  success: boolean;

  month: number;

  year: number;

  totalItemsSold: number;

  totalRevenue: number;

  topProducts: MonthlySalesProduct[];

  lowProducts: MonthlySalesProduct[];
}



/* =========================================================
   ORDER SERVICE
========================================================= */

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  private readonly apiUrl =
    `${environment.apiUrl}/orders`;


  constructor(
    private http: HttpClient
  ) {}


  /* =====================================================
     ADMIN AUTH HEADER
  ===================================================== */

  private getAuthHeaders(): HttpHeaders {

    const token =
      localStorage.getItem(
        'admin_token'
      ) || '';


    return new HttpHeaders({

      Authorization:
        `Bearer ${token}`

    });
  }



  /* =====================================================
     CUSTOMER CREATE ORDER
  ===================================================== */

  createOrder(
    orderData: CreateOrderData
  ): Observable<CreateOrderResponse> {

    return this.http.post<CreateOrderResponse>(

      this.apiUrl,

      orderData,

      {
        /*
          VERY IMPORTANT

          Customer authentication uses
          httpOnly userToken cookie.

          Without withCredentials,
          backend protectUser may return 401.
        */
        withCredentials: true
      }

    );
  }



  /* =====================================================
     CUSTOMER GET MY ORDERS
  ===================================================== */

  getMyOrders():
    Observable<MyOrdersResponse> {

    return this.http.get<MyOrdersResponse>(

      `${this.apiUrl}/my`,

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

    `${this.apiUrl}/my/${orderId}/bill`,

    {
      withCredentials: true,
      responseType: 'blob'
    }

  );
}

  /* =====================================================
     ADMIN GET ALL ORDERS
  ===================================================== */

  getAdminOrders():
    Observable<CustomerOrder[]> {

    return this.http.get<CustomerOrder[]>(

      `${this.apiUrl}/admin/all`,

      {
        headers:
          this.getAuthHeaders()
      }

    );
  }



  /* =====================================================
     ADMIN UPDATE STATUS
  ===================================================== */

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
        headers:
          this.getAuthHeaders()
      }

    );
  }



  /* =====================================================
     ADMIN DELETE ORDER
  ===================================================== */

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
        headers:
          this.getAuthHeaders()
      }

    );
  }



  /* =====================================================
     ADMIN MONTHLY SALES
  ===================================================== */

  getMonthlySales(

    month: number,

    year: number

  ): Observable<MonthlySalesResponse> {

    return this.http.get<MonthlySalesResponse>(

      `${this.apiUrl}/admin/monthly-sales?month=${month}&year=${year}`,

      {
        headers:
          this.getAuthHeaders()
      }

    );
  }

}