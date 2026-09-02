import {
  Component,
  inject,
    OnInit
} from '@angular/core';
 import {
  Product,
  ProductService
} from '../../services/product';
import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  FormsModule,
  NgForm
} from '@angular/forms';

import {
  CartItem,
  CartService
} from '../../services/cart';

import {
  Language,
  LanguageService
} from '../../services/language.service';

import {
  CreateOrderData,
  OrderService
} from '../../services/order';


@Component({
  selector: 'app-cart',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],

  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {
  private readonly cartService =
    inject(CartService);

  private readonly languageService =
    inject(LanguageService);

  private readonly orderService =
    inject(OrderService);
  private readonly productService =
  inject(ProductService);

  readonly cartItems$ =
    this.cartService.cartItems$;

  readonly cartCount$ =
    this.cartService.cartCount$;

  readonly cartTotal$ =
    this.cartService.cartTotal$;


  language: Language = 'ta';

  showCheckoutForm = false;

  submittingOrder = false;

  orderPlaced = false;

  placedOrderId = '';

  checkoutMessage = '';

  checkoutError = '';


  customerForm = {
    name: '',
    phone: '',
    email: '',
    address: ''
  };


  constructor() {
    this.languageService.language$.subscribe(
      (language: Language) => {
        this.language = language;
      }
    );
  }
ngOnInit(): void {
  const cartItems =
    this.cartService.getCartItems();

  if (cartItems.length === 0) {
    return;
  }

  const productIds = cartItems.map(
    item => item.product._id
  );

  this.productService
    .validateCartProducts(productIds)
    .subscribe({
      next: (products: Product[]) => {
        this.cartService.syncWithProducts(products);
      },

      error: error => {
        console.error(
          'Unable to validate cart products:',
          error
        );
      }
    });
}
hasOutOfStockProducts(): boolean {
  return this.cartService
    .getCartItems()
    .some(item => !item.product.isActive);
}

 
      openCheckoutForm(): void {
  if (this.hasOutOfStockProducts()) {
    this.checkoutError =
      this.language === 'ta'
        ? 'கையிருப்பில் இல்லாத பொருட்களை அகற்றவும்.'
        : this.language === 'hi'
          ? 'स्टॉक में नहीं उपलब्ध उत्पादों को हटाएँ।'
          : 'Please remove out-of-stock products.';

    return;
  }

  this.showCheckoutForm = true;
  this.orderPlaced = false;
  this.checkoutMessage = '';
  this.checkoutError = '';

  setTimeout(() => {
    document
      .getElementById('checkout-form')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  });
}
   


  closeCheckoutForm(): void {
    if (this.submittingOrder) {
      return;
    }

    this.showCheckoutForm = false;
    this.checkoutMessage = '';
    this.checkoutError = '';
  }


  submitCheckout(form: NgForm): void {
    this.checkoutMessage = '';
    this.checkoutError = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.submittingOrder) {
      return;
    }

    const cartItems =
      this.cartService.getCartItems();

    if (cartItems.length === 0) {
      this.checkoutError =
        'Your cart is empty. Please add a product.';
      return;
    }
   if (cartItems.some(item => !item.product.isActive)) {
  this.checkoutError =
    'Please remove out-of-stock products before checkout.';
  return;
}

    const orderData: CreateOrderData = {
      customerName:
        this.customerForm.name.trim(),

      phone:
        this.customerForm.phone.trim(),

      address:
        this.customerForm.address.trim(),

      items: cartItems.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      }))
    };


    const email =
      this.customerForm.email.trim();

    if (email) {
      orderData.email = email;
    }


    this.submittingOrder = true;


    this.orderService
      .createOrder(orderData)
      .subscribe({
        next: response => {
          this.submittingOrder = false;

          this.orderPlaced = true;

          this.placedOrderId =
            response.order._id;

          this.checkoutMessage =
            response.message ||
            'Order placed successfully.';

          this.showCheckoutForm = false;

          this.cartService.clearCart();

          this.customerForm = {
            name: '',
            phone: '',
            email: '',
            address: ''
          };

          form.resetForm();

          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          });
        },

        error: error => {
          this.submittingOrder = false;

          this.checkoutError =
            error.error?.message ||
            'Unable to place your order. Please try again.';
        }
      });
  }


  increaseQuantity(productId: string): void {
    this.cartService.increaseQuantity(productId);
  }


  decreaseQuantity(productId: string): void {
    this.cartService.decreaseQuantity(productId);
  }


  removeProduct(productId: string): void {
    this.cartService.removeProduct(productId);

    if (
      this.cartService.getCartItems().length === 0
    ) {
      this.showCheckoutForm = false;
    }
  }


  clearCart(): void {
    const confirmed = window.confirm(
      'Remove all products from your cart?'
    );

    if (confirmed) {
      this.cartService.clearCart();

      this.showCheckoutForm = false;
      this.checkoutMessage = '';
      this.checkoutError = '';
      this.orderPlaced = false;
    }
  }


  getProductName(item: CartItem): string {
    if (this.language === 'ta') {
      return item.product.name.ta;
    }

    if (this.language === 'hi') {
      return item.product.name.hi;
    }

    return item.product.name.en;
  }


  getSecondaryName(item: CartItem): string {
    if (this.language === 'ta') {
      return item.product.name.en;
    }

    return item.product.name.ta;
  }


  getItemTotal(item: CartItem): number {
    return (
      item.product.price *
      item.quantity
    );
  }


  trackCartItem(
    _index: number,
    item: CartItem
  ): string {
    return item.product._id;
  }
}