import {
  Component,
  inject,
  OnInit
} from '@angular/core';

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
  Observable,
  map
} from 'rxjs';

import {
  Product,
  ProductService
} from '../../services/product';

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


  readonly cartItems$: Observable<CartItem[]> =
    this.cartService.cartItems$;


  /*
   * Counts only available products.
   * Out-of-stock products are not included.
   */
  readonly cartCount$: Observable<number> =
    this.cartItems$.pipe(
      map((items: CartItem[]) => {
        return items
          .filter((item: CartItem) =>
            item.product.isActive
          )
          .reduce(
            (
              count: number,
              item: CartItem
            ) => {
              return count + item.quantity;
            },
            0
          );
      })
    );


  /*
   * Calculates only available product prices.
   * Out-of-stock products have no effect on total.
   */
  readonly cartTotal$: Observable<number> =
    this.cartItems$.pipe(
      map((items: CartItem[]) => {
        return items
          .filter((item: CartItem) =>
            item.product.isActive
          )
          .reduce(
            (
              total: number,
              item: CartItem
            ) => {
              return (
                total +
                item.product.price *
                item.quantity
              );
            },
            0
          );
      })
    );


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
      (item: CartItem) =>
        item.product._id
    );

    this.productService
      .validateCartProducts(productIds)
      .subscribe({
        next: (products: Product[]) => {
          this.cartService
            .syncWithProducts(products);
        },

        error: error => {
          console.error(
            'Unable to validate cart products:',
            error
          );
        }
      });
  }


  /*
   * Returns only available cart items.
   */
  private getAvailableCartItems(): CartItem[] {
    return this.cartService
      .getCartItems()
      .filter(
        (item: CartItem) =>
          item.product.isActive
      );
  }

hasOutOfStockProducts(): boolean {
  return this.getAvailableCartItems().length === 0;
}
  /*
   * Opens checkout when at least one
   * available product exists.
   */
  openCheckoutForm(): void {
    const availableItems =
      this.getAvailableCartItems();

    if (availableItems.length === 0) {
      this.checkoutError =
        this.language === 'ta'
          ? 'ஆர்டர் செய்ய கையிருப்பில் உள்ள பொருட்கள் இல்லை.'
          : this.language === 'hi'
            ? 'ऑर्डर करने के लिए कोई उत्पाद स्टॉक में नहीं है।'
            : 'There are no available products to checkout.';

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

    /*
     * Only available products are used
     * for creating the order.
     */
    const availableCartItems =
      this.getAvailableCartItems();

    if (availableCartItems.length === 0) {
      this.checkoutError =
        this.language === 'ta'
          ? 'ஆர்டர் செய்ய கையிருப்பில் உள்ள பொருட்கள் இல்லை.'
          : this.language === 'hi'
            ? 'ऑर्डर करने के लिए कोई उत्पाद स्टॉक में नहीं है।'
            : 'There are no available products to checkout.';

      return;
    }


    const orderData: CreateOrderData = {
      customerName:
        this.customerForm.name.trim(),

      phone:
        this.customerForm.phone.trim(),

      address:
        this.customerForm.address.trim(),

      /*
       * Out-of-stock products are excluded.
       */
      items: availableCartItems.map(
        (item: CartItem) => ({
          productId:
            item.product._id,

          quantity:
            item.quantity
        })
      )
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
    const item =
      this.cartService
        .getCartItems()
        .find(
          (cartItem: CartItem) =>
            cartItem.product._id === productId
        );

    /*
     * Do not increase quantity for
     * an out-of-stock product.
     */
    if (!item || !item.product.isActive) {
      return;
    }

    this.cartService
      .increaseQuantity(productId);
  }


  decreaseQuantity(productId: string): void {
    const item =
      this.cartService
        .getCartItems()
        .find(
          (cartItem: CartItem) =>
            cartItem.product._id === productId
        );

    /*
     * Do not change quantity for
     * an out-of-stock product.
     */
    if (!item || !item.product.isActive) {
      return;
    }

    this.cartService
      .decreaseQuantity(productId);
  }


  removeProduct(productId: string): void {
    this.cartService
      .removeProduct(productId);

    if (
      this.cartService
        .getCartItems()
        .length === 0
    ) {
      this.showCheckoutForm = false;
    }
  }


  clearCart(): void {
    const confirmed = window.confirm(
      'Remove all products from your cart?'
    );

    if (!confirmed) {
      return;
    }

    this.cartService.clearCart();

    this.showCheckoutForm = false;

    this.checkoutMessage = '';

    this.checkoutError = '';

    this.orderPlaced = false;
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


  /*
   * Displays zero for an out-of-stock product.
   */
  getItemTotal(item: CartItem): number {
    if (!item.product.isActive) {
      return 0;
    }

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