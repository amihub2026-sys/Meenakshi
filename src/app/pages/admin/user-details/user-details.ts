import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  CustomerOrder,
  OrderService,
  OrderStatus
} from '../../../services/order';

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
export class AdminUserDetailsComponent implements OnInit {

  orders: CustomerOrder[] = [];
  selectedOrder: CustomerOrder | null = null;

  searchTerm = '';
  statusFilter = 'all';

  isLoading = false;

  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  get filteredOrders(): CustomerOrder[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.orders.filter(order => {
      const matchesSearch =
        !search ||
        order.customerName.toLowerCase().includes(search) ||
        order.phone.toLowerCase().includes(search) ||
        order.email.toLowerCase().includes(search) ||
        order.productName.toLowerCase().includes(search) ||
        order.address.toLowerCase().includes(search);

      const matchesStatus =
        this.statusFilter === 'all' ||
        order.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  loadOrders(): void {
    this.isLoading = true;
    this.clearMessage();

    this.orderService.getAdminOrders().subscribe({
      next: orders => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: error => {
        console.error('Unable to load orders:', error);

        this.orders = [];
        this.isLoading = false;

        this.showMessage(
          'Unable to load customer orders. Make sure the backend is running.',
          'error'
        );
      }
    });
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
      .updateOrderStatus(order._id, status)
      .subscribe({
        next: updatedOrder => {
          const index = this.orders.findIndex(
            currentOrder => currentOrder._id === order._id
          );

          if (index !== -1) {
            this.orders[index] = updatedOrder;
          }

          if (this.selectedOrder?._id === order._id) {
            this.selectedOrder = updatedOrder;
          }

          this.showMessage(
            'Order status updated successfully.',
            'success'
          );
        },
        error: error => {
          console.error('Unable to update order status:', error);

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

    this.orderService.deleteOrder(order._id).subscribe({
      next: () => {
        this.orders = this.orders.filter(
          currentOrder => currentOrder._id !== order._id
        );

        if (this.selectedOrder?._id === order._id) {
          this.closeOrderDetails();
        }

        this.showMessage(
          'Order deleted successfully.',
          'success'
        );
      },
      error: error => {
        console.error('Unable to delete order:', error);

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
}