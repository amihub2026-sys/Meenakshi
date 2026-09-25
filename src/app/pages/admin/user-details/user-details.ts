import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  CustomerOrder,
  OrderItem,
  OrderService,
  OrderStatus
} from '../../../services/order';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin-user-details',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './user-details.html',
  styleUrl: './user-details.css'
})
export class AdminUserDetailsComponent
  implements OnInit {

  orders: CustomerOrder[] = [];

  selectedOrder: CustomerOrder | null = null;

  searchTerm = '';

  statusFilter = 'all';

  isLoading = false;

  message = '';

  messageType:
    'success' | 'error' = 'success';


  constructor(
    private orderService: OrderService
  ) {}


  ngOnInit(): void {
    this.loadOrders();
  }


  get filteredOrders(): CustomerOrder[] {
    const search =
      this.searchTerm
        .trim()
        .toLowerCase();

    return this.orders.filter(order => {
      const productMatches =
        order.items.some(item =>
          item.productName
            .toLowerCase()
            .includes(search)
        );

      const matchesSearch =
        !search ||
        order.customerName
          .toLowerCase()
          .includes(search) ||
        order.phone
          .toLowerCase()
          .includes(search) ||
        (order.email || '')
          .toLowerCase()
          .includes(search) ||
        order.address
          .toLowerCase()
          .includes(search) ||
        order._id
          .toLowerCase()
          .includes(search) ||
        productMatches;

      const matchesStatus =
        this.statusFilter === 'all' ||
        order.status === this.statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }


  loadOrders(): void {
    this.isLoading = true;
    this.clearMessage();

    this.orderService
      .getAdminOrders()
      .subscribe({
        next: orders => {
          this.orders = orders;
          this.isLoading = false;
        },

        error: error => {
          console.error(
            'Unable to load orders:',
            error
          );

          this.orders = [];
          this.isLoading = false;

          this.showMessage(
            'Unable to load customer orders. Make sure the backend is running.',
            'error'
          );
        }
      });
  }


  getTotalQuantity(
    order: CustomerOrder
  ): number {
    return order.items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }


  viewOrder(order: CustomerOrder): void {
    this.selectedOrder = order;
  }


  closeOrderDetails(): void {
    this.selectedOrder = null;
  }


  updateStatus(
    order: CustomerOrder,
    status: OrderStatus
  ): void {
    const previousStatus = order.status;

    order.status = status;

    this.orderService
      .updateOrderStatus(
        order._id,
        status
      )
      .subscribe({
        next: updatedOrder => {
          const index =
            this.orders.findIndex(
              currentOrder =>
                currentOrder._id ===
                order._id
            );

          if (index !== -1) {
            this.orders[index] =
              updatedOrder;
          }

          if (
            this.selectedOrder?._id ===
            order._id
          ) {
            this.selectedOrder =
              updatedOrder;
          }

          this.showMessage(
            'Order status updated successfully.',
            'success'
          );
        },

        error: error => {
          console.error(
            'Unable to update order status:',
            error
          );

          order.status = previousStatus;

          this.showMessage(
            'Unable to update the order status.',
            'error'
          );
        }
      });
  }


  deleteOrder(order: CustomerOrder): void {
    const confirmed = window.confirm(
      `Delete the order from ${order.customerName}?`
    );

    if (!confirmed) {
      return;
    }

    this.orderService
      .deleteOrder(order._id)
      .subscribe({
        next: () => {
          this.orders =
            this.orders.filter(
              currentOrder =>
                currentOrder._id !==
                order._id
            );

          if (
            this.selectedOrder?._id ===
            order._id
          ) {
            this.closeOrderDetails();
          }

          this.showMessage(
            'Order deleted successfully.',
            'success'
          );
        },

        error: error => {
          console.error(
            'Unable to delete order:',
            error
          );

          this.showMessage(
            'Unable to delete the order.',
            'error'
          );
        }
      });
  }


  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
  }


  trackOrder(
    _index: number,
    order: CustomerOrder
  ): string {
    return order._id;
  }


  trackOrderItem(
    _index: number,
    item: OrderItem
  ): string {
    return item.productId;
  }


  private showMessage(
    text: string,
    type: 'success' | 'error'
  ): void {
    this.message = text;
    this.messageType = type;

    window.setTimeout(() => {
      this.clearMessage();
    }, 4000);
  }


  private clearMessage(): void {
    this.message = '';
  }
downloadOrdersExcel(): void {

  if (this.filteredOrders.length === 0) {

    this.showMessage(
      'No orders available to download.',
      'error'
    );

    return;
  }


  const rows: any[] = [];


  this.filteredOrders.forEach(
    (order, orderIndex) => {

      const totalOrderQuantity =
        this.getTotalQuantity(order);


      order.items.forEach(
        (item, itemIndex) => {

          const isFirstProduct =
            itemIndex === 0;


          rows.push({

            /* =========================
               ORDER DETAILS
               ONLY FIRST PRODUCT ROW
            ========================= */

            'S.No':
              isFirstProduct
                ? orderIndex + 1
                : '',


            'Order ID':
              isFirstProduct
                ? order._id
                : '',


            'Order Date':
              isFirstProduct
                ? (
                    order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleString(
                          'en-IN'
                        )
                      : ''
                  )
                : '',


            /* =========================
               CUSTOMER
               ONLY FIRST PRODUCT ROW
            ========================= */

            'Customer Name':
              isFirstProduct
                ? order.customerName
                : '',


            'Phone':
              isFirstProduct
                ? order.phone
                : '',


            'Email':
              isFirstProduct
                ? order.email || ''
                : '',


            /* =========================
               ADDRESS
               ONLY FIRST PRODUCT ROW
            ========================= */

            'Address':
              isFirstProduct
                ? order.address
                : '',


            'District':
              isFirstProduct
                ? order.district || ''
                : '',


            'State':
              isFirstProduct
                ? order.state || ''
                : '',


            'Pincode':
              isFirstProduct
                ? order.pincode || ''
                : '',


            /* =========================
               PRODUCT
               EVERY PRODUCT ROW
            ========================= */

            'Product Name':
              item.productName,


            'Variant Quantity':
              item.variantQuantity ?? '',


            'Variant Unit':
              item.variantUnit || '',


            'Product Quantity':
              item.quantity,


            'Unit Price':
              item.price,


            'Line Total':
              item.lineTotal,


            /* =========================
               ORDER TOTALS
               ONLY FIRST PRODUCT ROW
            ========================= */

            'Total Order Quantity':
              isFirstProduct
                ? totalOrderQuantity
                : '',


            'Subtotal':
              isFirstProduct
                ? order.subtotal
                : '',


            'Delivery Type':
              isFirstProduct
                ? order.deliveryType
                : '',


            'Shipping Weight (KG)':
              isFirstProduct
                ? order.shippingWeight
                : '',


            'Delivery Charge':
              isFirstProduct
                ? order.deliveryCharge
                : '',


            'Final Order Total':
              isFirstProduct
                ? order.total
                : '',


            /* =========================
               PAYMENT
               ONLY FIRST PRODUCT ROW
            ========================= */

            'Payment Method':
              isFirstProduct
                ? order.paymentMethod
                : '',


            'Payment Status':
              isFirstProduct
                ? order.paymentStatus
                : '',


            'Payment ID':
              isFirstProduct
                ? order.paymentId || ''
                : '',


            /* =========================
               STATUS
               ONLY FIRST PRODUCT ROW
            ========================= */

            'Order Status':
              isFirstProduct
                ? order.status
                : ''

          });

        }

      );

    }

  );


  /* =========================
     CREATE WORKSHEET
  ========================= */

  const worksheet =
    XLSX.utils.json_to_sheet(
      rows
    );


  /* =========================
     COLUMN WIDTHS
  ========================= */

  worksheet['!cols'] = [

    { wch: 7 },   // S.No

    { wch: 28 },  // Order ID

    { wch: 23 },  // Order Date

    { wch: 22 },  // Customer

    { wch: 16 },  // Phone

    { wch: 30 },  // Email

    { wch: 40 },  // Address

    { wch: 20 },  // District

    { wch: 20 },  // State

    { wch: 12 },  // Pincode

    { wch: 30 },  // Product Name

    { wch: 16 },  // Variant Quantity

    { wch: 14 },  // Variant Unit

    { wch: 16 },  // Product Quantity

    { wch: 14 },  // Unit Price

    { wch: 14 },  // Line Total

    { wch: 20 },  // Total Order Quantity

    { wch: 14 },  // Subtotal

    { wch: 16 },  // Delivery Type

    { wch: 20 },  // Shipping Weight

    { wch: 18 },  // Delivery Charge

    { wch: 18 },  // Final Order Total

    { wch: 18 },  // Payment Method

    { wch: 18 },  // Payment Status

    { wch: 25 },  // Payment ID

    { wch: 16 }   // Order Status

  ];


  /* =========================
     CREATE WORKBOOK
  ========================= */

  const workbook =
    XLSX.utils.book_new();


  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Orders'
  );


  /* =========================
     FILE NAME
  ========================= */

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);


  XLSX.writeFile(
    workbook,
    `meenakshi-orders-${today}.xlsx`
  );


  this.showMessage(
    'Order Excel downloaded successfully.',
    'success'
  );

}
}