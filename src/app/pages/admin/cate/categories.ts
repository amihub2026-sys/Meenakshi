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
  editingId: string | null = null;

  form: Category = {
    name: {
      en: '',
      ta: '',
      hi: ''
    },
    imageUrl: '',
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

  saveCategory(): void {

    if (
      !this.form.name.en.trim() ||
      !this.form.name.ta.trim() ||
      !this.form.name.hi.trim()
    ) {
      alert('Please enter all 3 language names');
      return;
    }

    if (this.editingId) {

      this.categoryService
        .updateCategory(
          this.editingId,
          this.form
        )
        .subscribe({
          next: () => {
            alert('Category updated successfully');

            this.resetForm();
            this.loadCategories();
          },

          error: (error) => {
            console.error(error);
            alert('Unable to update category');
          }
        });

      return;
    }

    this.categoryService
      .createCategory(this.form)
      .subscribe({
        next: () => {
          alert('Category added successfully');

          this.resetForm();
          this.loadCategories();
        },

        error: (error) => {
          console.error(error);
          alert('Unable to add category');
        }
      });
  }

  editCategory(category: Category): void {

    if (!category._id) {
      return;
    }

    this.editingId = category._id;

    this.form = {
      name: {
        en: category.name.en,
        ta: category.name.ta,
        hi: category.name.hi
      },

      imageUrl: category.imageUrl || '',

      isActive: category.isActive
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  deleteCategory(category: Category): void {

    if (!category._id) {
      return;
    }

    const confirmed = confirm(
      `Delete "${category.name.en}" category?`
    );

    if (!confirmed) {
      return;
    }

    this.categoryService
      .deleteCategory(category._id)
      .subscribe({
        next: () => {
          alert('Category deleted successfully');

          this.loadCategories();
        },

        error: (error) => {
          console.error(error);
          alert('Unable to delete category');
        }
      });
  }

  toggleStatus(category: Category): void {

    if (!category._id) {
      return;
    }

    const updated: Category = {
      ...category,
      isActive: !category.isActive
    };

    this.categoryService
      .updateCategory(
        category._id,
        updated
      )
      .subscribe({
        next: () => {
          this.loadCategories();
        },

        error: (error) => {
          console.error(error);
          alert('Unable to change category status');
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
      imageUrl: '',
      isActive: true
    };
  }
}