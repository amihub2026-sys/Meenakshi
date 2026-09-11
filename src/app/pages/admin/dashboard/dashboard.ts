import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product';
import {
  CategoryService
} from '../../../services/category.service';
import {
  OrderService,
  MonthlySalesResponse
} from '../../../services/order';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
      FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class AdminDashboardComponent
  implements OnInit {

  private readonly productService =
    inject(ProductService);

  private readonly categoryService =
    inject(CategoryService);

private readonly orderService =
  inject(OrderService);

monthlySales?: MonthlySalesResponse;

selectedMonth =
  new Date().getMonth() + 1;

selectedYear =
  new Date().getFullYear();
  totalProducts = 0;

  activeProducts = 0;

  disabledProducts = 0;


  totalCategories = 0;

  activeCategories = 0;

  disabledCategories = 0;


  totalUsers = 0;

onMonthChange(): void {
  this.loadMonthlySales();
}
  ngOnInit(): void {

    this.loadProductCounts();

    this.loadCategoryCounts();
      this.loadMonthlySales();
  }

loadMonthlySales(): void {
  this.orderService
    .getMonthlySales(
      this.selectedMonth,
      this.selectedYear
    )
    .subscribe({

      next: response => {

        this.monthlySales = response;

        console.log(
          'MONTHLY SALES:',
          response
        );

      },

      error: error => {

        console.error(
          'Unable to load monthly sales:',
          error
        );

      }

    });

}
  private loadProductCounts(): void {

    this.productService
      .getAdminProducts()
      .subscribe({

        next: products => {

          this.totalProducts =
            products.length;

          this.activeProducts =
            products.filter(
              product => product.isActive
            ).length;

          this.disabledProducts =
            products.filter(
              product => !product.isActive
            ).length;

        },

        error: error => {

          console.error(
            'Unable to load product count:',
            error
          );

        }

      });

  }


  private loadCategoryCounts(): void {

    this.categoryService
      .getCategories()
      .subscribe({

        next: categories => {

          this.totalCategories =
            categories.length;

          this.activeCategories =
            categories.filter(
              category => category.isActive
            ).length;

          this.disabledCategories =
            categories.filter(
              category => !category.isActive
            ).length;

        },

        error: error => {

          console.error(
            'Unable to load category count:',
            error
          );

        }

      });

  }

}