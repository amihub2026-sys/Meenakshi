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

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
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


  totalProducts = 0;

  activeProducts = 0;

  disabledProducts = 0;


  totalCategories = 0;

  activeCategories = 0;

  disabledCategories = 0;


  totalUsers = 0;


  ngOnInit(): void {

    this.loadProductCounts();

    this.loadCategoryCounts();

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