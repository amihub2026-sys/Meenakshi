import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Product,
  ProductService,
  
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

export class AdminProductsComponent
  implements OnInit {

  products: Product[] = [];

  categories: Category[] = [];


  productForm = {
    categoryId: '',
    nameEn: '',
    nameTa: '',
    nameHi: '',
    description: '',
    price: '',
    quantity: '',
    unit: ''
  };
unitOptions = [
  { value: 'g', label: 'Gram (g)' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'ml', label: 'Milliliter (ml)' },
  { value: 'l', label: 'Liter (L)' },
  { value: 'piece', label: 'Piece' },
  { value: 'packet', label: 'Packet' },
  { value: 'box', label: 'Box' }
];


quantityOptions: {
  [key: string]: {
    value: string;
    label: string;
  }[]
} = {

  g: [
    { value: '50', label: '50 g' },
    { value: '100', label: '100 g' },
    { value: '250', label: '250 g' },
    { value: '500', label: '500 g' },
    { value: '750', label: '750 g' },
    { value: '1000', label: '1000 g' }
  ],

  kg: [
    { value: '0.25', label: '¼ kg' },
    { value: '0.5', label: '½ kg' },
    { value: '0.75', label: '¾ kg' },
    { value: '1', label: '1 kg' },
    { value: '2', label: '2 kg' },
    { value: '5', label: '5 kg' }
  ],

  ml: [
    { value: '100', label: '100 ml' },
    { value: '250', label: '250 ml' },
    { value: '500', label: '500 ml' },
    { value: '750', label: '750 ml' },
    { value: '1000', label: '1000 ml' }
  ],

  l: [
    { value: '0.25', label: '¼ L' },
    { value: '0.5', label: '½ L' },
    { value: '0.75', label: '¾ L' },
    { value: '1', label: '1 L' },
    { value: '2', label: '2 L' },
    { value: '5', label: '5 L' }
  ],

  piece: [
    { value: '1', label: '1 Piece' },
    { value: '2', label: '2 Pieces' },
    { value: '3', label: '3 Pieces' },
    { value: '5', label: '5 Pieces' },
    { value: '10', label: '10 Pieces' }
  ],

  packet: [
    { value: '1', label: '1 Packet' },
    { value: '2', label: '2 Packets' },
    { value: '3', label: '3 Packets' },
    { value: '5', label: '5 Packets' },
    { value: '10', label: '10 Packets' }
  ],

  box: [
    { value: '1', label: '1 Box' },
    { value: '2', label: '2 Boxes' },
    { value: '3', label: '3 Boxes' },
    { value: '5', label: '5 Boxes' },
    { value: '10', label: '10 Boxes' }
  ]
};


getAvailableQuantities() {

  if (!this.productForm.unit) {
    return [];
  }

  return (
    this.quantityOptions[
      this.productForm.unit
    ] || []
  );
}


onUnitChange(): void {

  this.productForm.quantity = '';
}

  selectedFile:
    File | null = null;

  imagePreview = '';


  editingProductId:
    string | null = null;


  loading = false;

  productsLoading = false;

  categoriesLoading = false;


  message = '';

  errorMessage = '';


  constructor(
    private productService:
      ProductService,

    private categoryService:
      CategoryService
  ) {}


  ngOnInit(): void {

    this.loadCategories();

    this.loadProducts();
  }


  // =====================================
  // LOAD CATEGORIES
  // =====================================

  loadCategories(): void {

    this.categoriesLoading = true;


    this.categoryService
      .getCategories()
      .subscribe({

        next: (categories) => {

          this.categories =
            categories.filter(
              category =>
                category.isActive
            );

          this.categoriesLoading =
            false;
        },


        error: (error) => {

          console.error(
            'Unable to load categories:',
            error
          );

          this.errorMessage =
            'Unable to load categories.';

          this.categoriesLoading =
            false;
        }

      });
  }


  // =====================================
  // LOAD PRODUCTS
  // =====================================

  loadProducts(): void {

    this.productsLoading = true;

    this.errorMessage = '';


    this.productService
      .getAdminProducts()
      .subscribe({

        next: (products) => {

          this.products =
            products;

          this.productsLoading =
            false;
        },


        error: (error) => {

          console.error(
            'Unable to load products:',
            error
          );

          this.errorMessage =
            'Unable to load products. Make sure the backend is running.';

          this.productsLoading =
            false;
        }

      });
  }


  // =====================================
  // IMAGE SELECT
  // =====================================

  onImageSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }


    const file =
      input.files[0];


    if (
      !file.type.startsWith('image/')
    ) {

      this.errorMessage =
        'Please select a valid image file.';

      input.value = '';

      return;
    }


    const maximumSize =
      5 * 1024 * 1024;


    if (
      file.size >
      maximumSize
    ) {

      this.errorMessage =
        'Image size must be below 5 MB.';

      input.value = '';

      return;
    }


    this.selectedFile =
      file;

    this.errorMessage = '';


    const reader =
      new FileReader();


    reader.onload = () => {

      this.imagePreview =
        reader.result as string;
    };


    reader.readAsDataURL(
      file
    );
  }


  // =====================================
  // SAVE PRODUCT
  // =====================================

  saveProduct(): void {

    this.message = '';

    this.errorMessage = '';


    const categoryId =
      this.productForm
        .categoryId
        .trim();


    const nameEn =
      this.productForm
        .nameEn
        .trim();


    const nameTa =
      this.productForm
        .nameTa
        .trim();


    const nameHi =
      this.productForm
        .nameHi
        .trim();


    const price =
      Number(
        this.productForm.price
      );


    const quantity =
      Number(
        this.productForm.quantity
      );


    const unit =
      this.productForm
        .unit
        .trim();


    // CATEGORY VALIDATION

    if (!categoryId) {

      this.errorMessage =
        'Please select a product category.';

      return;
    }


    // NAME VALIDATION

    if (
      !nameEn ||
      !nameTa ||
      !nameHi
    ) {

      this.errorMessage =
        'Please enter the product name in all three languages.';

      return;
    }


    // PRICE VALIDATION

    if (
      !price ||
      price <= 0
    ) {

      this.errorMessage =
        'Please enter a valid product price.';

      return;
    }


    // QUANTITY VALIDATION

    if (
      !quantity ||
      quantity <= 0
    ) {

      this.errorMessage =
        'Please enter a valid product quantity.';

      return;
    }


    // UNIT VALIDATION

    if (!unit) {

      this.errorMessage =
        'Please select a product unit.';

      return;
    }


const allowedUnits = [
  'g',
  'kg',
  'ml',
  'l',
  'piece',
  'packet',
  'box'
];

    if (
      !allowedUnits.includes(unit)
      )
     {

      this.errorMessage =
        'Please select a valid product unit.';

      return;
    }


    // IMAGE REQUIRED ONLY
    // WHEN ADDING NEW PRODUCT

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


    // CATEGORY

    formData.append(
      'categoryId',
      categoryId
    );


    // PRODUCT NAMES

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
  'description',
  this.productForm.description.trim()
);

    // PRICE

    formData.append(
      'price',
      String(price)
    );


    // QUANTITY

    formData.append(
      'quantity',
      String(quantity)
    );


    // UNIT

    formData.append(
      'unit',
      unit
    );


    // IMAGE

    if (
      this.selectedFile
    ) {

      formData.append(
        'image',
        this.selectedFile
      );
    }


    this.loading = true;


    // UPDATE

    if (
      this.editingProductId
    ) {

      this.updateProduct(
        this.editingProductId,
        formData
      );

    }

    // CREATE

    else {

      this.createProduct(
        formData
      );
    }
  }


  // =====================================
  // CREATE PRODUCT
  // =====================================

  private createProduct(
    formData: FormData
  ): void {

    this.productService
      .addProduct(
        formData
      )
      .subscribe({

        next: () => {

          this.message =
            'Product added successfully.';

          this.loading =
            false;

          this.resetForm();

          this.loadProducts();
        },


        error: (error) => {

          console.error(
            'Unable to add product:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Unable to add the product.';

          this.loading =
            false;
        }

      });
  }


  // =====================================
  // UPDATE PRODUCT
  // =====================================

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

          this.loading =
            false;

          this.resetForm();

          this.loadProducts();
        },


        error: (error) => {

          console.error(
            'Unable to update product:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Unable to update the product.';

          this.loading =
            false;
        }

      });
  }


  // =====================================
  // EDIT PRODUCT
  // =====================================

  editProduct(
    product: Product
  ): void {

    this.editingProductId =
      product._id;


    let categoryId = '';


    if (
      product.category
    ) {

      if (
        typeof product.category ===
        'string'
      ) {

        categoryId =
          product.category;

      } else {

        categoryId =
          product.category._id;
      }
    }


    this.productForm = {

      categoryId:
        categoryId,

      nameEn:
        product.name.en,

      nameTa:
        product.name.ta,

      nameHi:
        product.name.hi,
           description: product.description || '',
      price:
        String(
          product.price
        ),

      quantity:
        product.quantity !==
        undefined
          ? String(
              product.quantity
            )
          : '',

      unit:
        product.unit || ''
    };


    this.imagePreview =
      product.imageUrl;


    this.selectedFile =
      null;


    this.message = '';

    this.errorMessage = '';


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  selectedProduct: Product | null = null;

openProductDetails(product: Product): void {
  this.selectedProduct = product;
}

closeProductDetails(): void {
  this.selectedProduct = null;
}
getProductCategoryName(product: Product): string {

  if (
    product.category &&
    typeof product.category === 'object'
  ) {
    return product.category.name?.en || 'Unknown Category';
  }

  const categoryId =
    typeof product.category === 'string'
      ? product.category
      : '';

  const category = this.categories.find(
    item => item._id === categoryId
  );

  return category?.name?.en || 'Unknown Category';
}

  // =====================================
  // CHANGE STATUS
  // =====================================

  changeStatus(
    product: Product
  ): void {

    const newStatus =
      !product.isActive;


    this.productService
      .changeProductStatus(
        product._id,
        newStatus
      )
      .subscribe({

        next: (
          updatedProduct
        ) => {

          product.isActive =
            updatedProduct.isActive;


          this.message =
            updatedProduct.isActive
              ? 'Product enabled successfully.'
              : 'Product disabled successfully.';
        },


        error: (error) => {

          console.error(
            'Unable to change product status:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Unable to change the product status.';
        }

      });
  }


  // =====================================
  // DELETE PRODUCT
  // =====================================

  deleteProduct(
    product: Product
  ): void {

    const confirmed =
      window.confirm(
        `Delete "${product.name.en}" permanently?`
      );


    if (!confirmed) {
      return;
    }


    this.productService
      .deleteProduct(
        product._id
      )
      .subscribe({

        next: () => {

          this.message =
            'Product deleted successfully.';


          this.products =
            this.products.filter(
              item =>
                item._id !==
                product._id
            );


          if (
            this.editingProductId ===
            product._id
          ) {

            this.resetForm();
          }
        },


        error: (error) => {

          console.error(
            'Unable to delete product:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Unable to delete the product.';
        }

      });
  }


  // =====================================
  // RESET FORM
  // =====================================

  resetForm(): void {

    this.productForm = {

      categoryId: '',

      nameEn: '',

      nameTa: '',

      nameHi: '',
      description: '',
      price: '',

      quantity: '',

      unit: ''
    };


    this.selectedFile =
      null;


    this.imagePreview =
      '';


    this.editingProductId =
      null;


    this.message = '';

    this.errorMessage = '';


    const imageInput =
      document.getElementById(
        'productImage'
      ) as
        HTMLInputElement |
        null;


    if (
      imageInput
    ) {

      imageInput.value =
        '';
    }
  }


  // =====================================
  // TRACK PRODUCT
  // =====================================

  trackProduct(
    _index: number,
    product: Product
  ): string {

    return product._id;
  }
}