import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Category,
  CategoryService
} from '../../../services/category.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];

  loading = false;
  saving = false;

  editingId: string | null = null;

  selectedFile: File | null = null;
  imagePreview = '';

  form = {
    name: {
      en: '',
      ta: '',
      hi: ''
    },
    isActive: true
  };

  constructor(
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;

    this.categoryService
      .getCategories()
      .subscribe({
        next: (data) => {
          this.categories = data;
          this.loading = false;
        },

        error: (error) => {
          console.error(
            'Unable to load categories:',
            error
          );

          this.loading = false;
        }
      });
  }

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
      alert('Please select a valid image file');
      input.value = '';
      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert('Image size must be below 5 MB');
      input.value = '';
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview =
        reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  saveCategory(): void {

    if (
      !this.form.name.en.trim() ||
      !this.form.name.ta.trim() ||
      !this.form.name.hi.trim()
    ) {
      alert(
        'Please enter all 3 language names'
      );

      return;
    }

    if (
      !this.editingId &&
      !this.selectedFile
    ) {
      alert(
        'Please select a category image'
      );

      return;
    }

    const formData =
      new FormData();

    formData.append(
      'nameEn',
      this.form.name.en.trim()
    );

    formData.append(
      'nameTa',
      this.form.name.ta.trim()
    );

    formData.append(
      'nameHi',
      this.form.name.hi.trim()
    );

    formData.append(
      'isActive',
      String(this.form.isActive)
    );

    if (this.selectedFile) {
      formData.append(
        'image',
        this.selectedFile
      );
    }

    this.saving = true;

    if (this.editingId) {

      this.categoryService
        .updateCategory(
          this.editingId,
          formData
        )
        .subscribe({
          next: () => {

            alert(
              'Category updated successfully'
            );

            this.saving = false;

            this.resetForm();
            this.loadCategories();
          },

          error: (error) => {

            console.error(error);

            alert(
              error.error?.message ||
              'Unable to update category'
            );

            this.saving = false;
          }
        });

      return;
    }

    this.categoryService
      .createCategory(formData)
      .subscribe({
        next: () => {

          alert(
            'Category added successfully'
          );

          this.saving = false;

          this.resetForm();
          this.loadCategories();
        },

        error: (error) => {

          console.error(error);

          alert(
            error.error?.message ||
            'Unable to add category'
          );

          this.saving = false;
        }
      });
  }

  editCategory(
    category: Category
  ): void {

    if (!category._id) {
      return;
    }

    this.editingId =
      category._id;

    this.form = {
      name: {
        en: category.name.en,
        ta: category.name.ta,
        hi: category.name.hi
      },

      isActive:
        category.isActive
    };

    this.imagePreview =
      category.imageUrl || '';

    this.selectedFile = null;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  deleteCategory(
    category: Category
  ): void {

    if (!category._id) {
      return;
    }

    const confirmed =
      confirm(
        `Delete "${category.name.en}" category?`
      );

    if (!confirmed) {
      return;
    }

    this.categoryService
      .deleteCategory(
        category._id
      )
      .subscribe({
        next: () => {

          alert(
            'Category deleted successfully'
          );

          this.loadCategories();
        },

        error: (error) => {

          console.error(error);

          alert(
            error.error?.message ||
            'Unable to delete category'
          );
        }
      });
  }

  toggleStatus(
    category: Category
  ): void {

    if (!category._id) {
      return;
    }

    const formData =
      new FormData();

    formData.append(
      'nameEn',
      category.name.en
    );

    formData.append(
      'nameTa',
      category.name.ta
    );

    formData.append(
      'nameHi',
      category.name.hi
    );

    formData.append(
      'isActive',
      String(!category.isActive)
    );

    this.categoryService
      .updateCategory(
        category._id,
        formData
      )
      .subscribe({
        next: () => {
          this.loadCategories();
        },

        error: (error) => {

          console.error(error);

          alert(
            error.error?.message ||
            'Unable to change category status'
          );
        }
      });
  }

  resetForm(): void {

    this.editingId = null;

    this.form = {
      name: {
        en: '',
        ta: '',
        hi: ''
      },

      isActive: true
    };

    this.selectedFile = null;
    this.imagePreview = '';

    const imageInput =
      document.getElementById(
        'categoryImage'
      ) as HTMLInputElement | null;

    if (imageInput) {
      imageInput.value = '';
    }
  }
}