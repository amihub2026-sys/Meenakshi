import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Product,
  ProductService
} from '../../../services/product';

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

  productForm = {
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
  message = '';
  errorMessage = '';

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsLoading = true;
    this.errorMessage = '';

    this.productService.getAdminProducts().subscribe({
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

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select a valid image file.';
      input.value = '';
      return;
    }

    const maximumSize = 5 * 1024 * 1024;

    if (file.size > maximumSize) {
      this.errorMessage = 'Image size must be below 5 MB.';
      input.value = '';
      return;
    }

    this.selectedFile = file;
    this.errorMessage = '';

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  saveProduct(): void {
    this.message = '';
    this.errorMessage = '';

    const nameEn = this.productForm.nameEn.trim();
    const nameTa = this.productForm.nameTa.trim();
    const nameHi = this.productForm.nameHi.trim();
    const price = Number(this.productForm.price);

    if (!nameEn || !nameTa || !nameHi) {
      this.errorMessage =
        'Please enter the product name in all three languages.';
      return;
    }

    if (!price || price <= 0) {
      this.errorMessage = 'Please enter a valid product price.';
      return;
    }

    if (!this.editingProductId && !this.selectedFile) {
      this.errorMessage = 'Please select a product image.';
      return;
    }

    const formData = new FormData();

    formData.append('nameEn', nameEn);
    formData.append('nameTa', nameTa);
    formData.append('nameHi', nameHi);
    formData.append('price', String(price));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.loading = true;

    if (this.editingProductId) {
      this.updateProduct(this.editingProductId, formData);
    } else {
      this.createProduct(formData);
    }
  }

  private createProduct(formData: FormData): void {
    this.productService.addProduct(formData).subscribe({
      next: () => {
        this.message = 'Product added successfully.';
        this.loading = false;
        this.resetForm();
        this.loadProducts();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to add the product.';
        this.loading = false;
      }
    });
  }

  private updateProduct(
    productId: string,
    formData: FormData
  ): void {
    this.productService.updateProduct(productId, formData).subscribe({
      next: () => {
        this.message = 'Product updated successfully.';
        this.loading = false;
        this.resetForm();
        this.loadProducts();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to update the product.';
        this.loading = false;
      }
    });
  }

  editProduct(product: Product): void {
    this.editingProductId = product._id;

    this.productForm = {
      nameEn: product.name.en,
      nameTa: product.name.ta,
      nameHi: product.name.hi,
      price: String(product.price)
    };

    this.imagePreview = product.imageUrl;
    this.selectedFile = null;
    this.message = '';
    this.errorMessage = '';

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  changeStatus(product: Product): void {
    const newStatus = !product.isActive;

    this.productService
      .changeProductStatus(product._id, newStatus)
      .subscribe({
        next: (updatedProduct) => {
          product.isActive = updatedProduct.isActive;

          this.message = updatedProduct.isActive
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

  deleteProduct(product: Product): void {
    const confirmed = window.confirm(
      `Delete "${product.name.en}" permanently?`
    );

    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(product._id).subscribe({
      next: () => {
        this.message = 'Product deleted successfully.';
        this.products = this.products.filter(
          item => item._id !== product._id
        );

        if (this.editingProductId === product._id) {
          this.resetForm();
        }
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to delete the product.';
      }
    });
  }

  resetForm(): void {
    this.productForm = {
      nameEn: '',
      nameTa: '',
      nameHi: '',
      price: ''
    };

    this.selectedFile = null;
    this.imagePreview = '';
    this.editingProductId = null;

    const imageInput =
      document.getElementById('productImage') as HTMLInputElement | null;

    if (imageInput) {
      imageInput.value = '';
    }
  }

  trackProduct(
    index: number,
    product: Product
  ): string {
    return product._id;
  }
}