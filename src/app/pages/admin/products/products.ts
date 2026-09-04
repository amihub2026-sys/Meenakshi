import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Product,
  ProductService
} from '../../../services/product';

import {
  Category,
  CategoryService
} from '../../../services/category.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class AdminProductsComponent implements OnInit {

  products: Product[] = [];
  categories: Category[] = [];

  productForm = {
    categoryId: '',
    nameEn: '',
    nameTa: '',
    nameHi: '',
    price: ''
  };

  selectedFile: File | null = null;
  imagePreview = '';

  editingProductId: string | null = null;

  loading = false;
  productsLoading = false;
  categoriesLoading = false;

  message = '';
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }


  /* =====================================
     LOAD CATEGORIES
  ====================================== */

  loadCategories(): void {
    this.categoriesLoading = true;

    this.categoryService
      .getCategories()
      .subscribe({
        next: (categories) => {
          this.categories = categories.filter(
            category => category.isActive
          );

          this.categoriesLoading = false;
        },

        error: (error) => {
          console.error(
            'Unable to load categories:',
            error
          );

          this.errorMessage =
            'Unable to load categories.';

          this.categoriesLoading = false;
        }
      });
  }


  /* =====================================
     LOAD PRODUCTS
  ====================================== */

  loadProducts(): void {
    this.productsLoading = true;
    this.errorMessage = '';

    this.productService
      .getAdminProducts()
      .subscribe({
        next: (products) => {
          this.products = products;
          this.productsLoading = false;
        },

        error: () => {
          this.errorMessage =
            'Unable to load products. Make sure the backend is running.';

          this.productsLoading = false;
        }
      });
  }


  /* =====================================
     IMAGE SELECT
  ====================================== */

  onImageSelected(event: Event): void {
    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.errorMessage =
        'Please select a valid image file.';

      input.value = '';
      return;
    }

    const maximumSize =
      5 * 1024 * 1024;

    if (file.size > maximumSize) {
      this.errorMessage =
        'Image size must be below 5 MB.';

      input.value = '';
      return;
    }

    this.selectedFile = file;
    this.errorMessage = '';

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview =
        reader.result as string;
    };

    reader.readAsDataURL(file);
  }


  /* =====================================
     SAVE PRODUCT
  ====================================== */

  saveProduct(): void {
    this.message = '';
    this.errorMessage = '';

    const categoryId =
      this.productForm.categoryId.trim();

    const nameEn =
      this.productForm.nameEn.trim();

    const nameTa =
      this.productForm.nameTa.trim();

    const nameHi =
      this.productForm.nameHi.trim();

    const price =
      Number(this.productForm.price);


    if (!categoryId) {
      this.errorMessage =
        'Please select a product category.';

      return;
    }


    if (
      !nameEn ||
      !nameTa ||
      !nameHi
    ) {
      this.errorMessage =
        'Please enter the product name in all three languages.';

      return;
    }


    if (!price || price <= 0) {
      this.errorMessage =
        'Please enter a valid product price.';

      return;
    }


    if (
      !this.editingProductId &&
      !this.selectedFile
    ) {
      this.errorMessage =
        'Please select a product image.';

      return;
    }


    const formData =
      new FormData();


    // IMPORTANT - CATEGORY
    formData.append(
      'category',
      categoryId
    );


    formData.append(
      'nameEn',
      nameEn
    );

    formData.append(
      'nameTa',
      nameTa
    );

    formData.append(
      'nameHi',
      nameHi
    );

    formData.append(
      'price',
      String(price)
    );


    if (this.selectedFile) {
      formData.append(
        'image',
        this.selectedFile
      );
    }


    this.loading = true;


    if (this.editingProductId) {

      this.updateProduct(
        this.editingProductId,
        formData
      );

    } else {

      this.createProduct(
        formData
      );

    }
  }


  /* =====================================
     CREATE PRODUCT
  ====================================== */

  private createProduct(
    formData: FormData
  ): void {

    this.productService
      .addProduct(formData)
      .subscribe({
        next: () => {
          this.message =
            'Product added successfully.';

          this.loading = false;

          this.resetForm();
          this.loadProducts();
        },

        error: (error) => {
          this.errorMessage =
            error.error?.message ||
            'Unable to add the product.';

          this.loading = false;
        }
      });
  }


  /* =====================================
     UPDATE PRODUCT
  ====================================== */

  private updateProduct(
    productId: string,
    formData: FormData
  ): void {

    this.productService
      .updateProduct(
        productId,
        formData
      )
      .subscribe({
        next: () => {
          this.message =
            'Product updated successfully.';

          this.loading = false;

          this.resetForm();
          this.loadProducts();
        },

        error: (error) => {
          this.errorMessage =
            error.error?.message ||
            'Unable to update the product.';

          this.loading = false;
        }
      });
  }


  /* =====================================
     EDIT PRODUCT
  ====================================== */

  editProduct(product: Product): void {

    this.editingProductId =
      product._id;


    let categoryId = '';


    if (product.category) {

      if (
        typeof product.category === 'string'
      ) {

        categoryId =
          product.category;

      } else {

        categoryId =
          product.category._id;

      }

    }


    this.productForm = {
      categoryId: categoryId,

      nameEn:
        product.name.en,

      nameTa:
        product.name.ta,

      nameHi:
        product.name.hi,

      price:
        String(product.price)
    };


    this.imagePreview =
      product.imageUrl;

    this.selectedFile = null;

    this.message = '';
    this.errorMessage = '';


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  /* =====================================
     CHANGE STATUS
  ====================================== */

  changeStatus(product: Product): void {

    const newStatus =
      !product.isActive;


    this.productService
      .changeProductStatus(
        product._id,
        newStatus
      )
      .subscribe({
        next: (updatedProduct) => {

          product.isActive =
            updatedProduct.isActive;


          this.message =
            updatedProduct.isActive
              ? 'Product enabled successfully.'
              : 'Product disabled successfully.';
        },

        error: (error) => {

          this.errorMessage =
            error.error?.message ||
            'Unable to change the product status.';
        }
      });
  }


  /* =====================================
     DELETE PRODUCT
  ====================================== */

  deleteProduct(product: Product): void {

    const confirmed =
      window.confirm(
        `Delete "${product.name.en}" permanently?`
      );


    if (!confirmed) {
      return;
    }


    this.productService
      .deleteProduct(product._id)
      .subscribe({
        next: () => {

          this.message =
            'Product deleted successfully.';


          this.products =
            this.products.filter(
              item =>
                item._id !== product._id
            );


          if (
            this.editingProductId ===
            product._id
          ) {

            this.resetForm();

          }
        },

        error: (error) => {

          this.errorMessage =
            error.error?.message ||
            'Unable to delete the product.';
        }
      });
  }


  /* =====================================
     RESET FORM
  ====================================== */

  resetForm(): void {

    this.productForm = {
      categoryId: '',
      nameEn: '',
      nameTa: '',
      nameHi: '',
      price: ''
    };


    this.selectedFile = null;
    this.imagePreview = '';
    this.editingProductId = null;


    const imageInput =
      document.getElementById(
        'productImage'
      ) as HTMLInputElement | null;


    if (imageInput) {
      imageInput.value = '';
    }
  }


  /* =====================================
     TRACK PRODUCT
  ====================================== */

  trackProduct(
    index: number,
    product: Product
  ): string {

    return product._id;
  }
}