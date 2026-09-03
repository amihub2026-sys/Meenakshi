import {
  Component,
  inject
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
export class CartComponent {

  private readonly cartService =
    inject(CartService);

  private readonly languageService =
    inject(LanguageService);

  private readonly orderService =
    inject(OrderService);


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


  openCheckoutForm(): void {

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
        this.translate(
          'Your cart is empty. Please add a product.',
          'உங்கள் கார்ட் காலியாக உள்ளது. ஒரு பொருளைச் சேர்க்கவும்.',
          'आपका कार्ट खाली है। कृपया एक उत्पाद जोड़ें।'
        );

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

        productId:
          item.product._id,

        quantity:
          item.quantity

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


          /*
           * If backend returns an English message,
           * we use our translated success message
           * for Tamil / Hindi.
           */

          if (this.language === 'en') {

            this.checkoutMessage =
              response.message ||
              'Order placed successfully.';

          } else {

            this.checkoutMessage =
              this.translate(
                'Order placed successfully.',
                'உங்கள் ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது.',
                'आपका ऑर्डर सफलतापूर्वक किया गया।'
              );

          }


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


          /*
           * Backend error message may be English,
           * so for Tamil/Hindi we show translated text.
           */

          if (
            this.language === 'en' &&
            error.error?.message
          ) {

            this.checkoutError =
              error.error.message;

          } else {

            this.checkoutError =
              this.translate(
                'Unable to place your order. Please try again.',
                'உங்கள் ஆர்டரை பதிவு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
                'आपका ऑर्डर नहीं किया जा सका। कृपया फिर से प्रयास करें।'
              );

          }

        }

      });

  }


  increaseQuantity(
    productId: string
  ): void {

    this.cartService
      .increaseQuantity(productId);

  }


  decreaseQuantity(
    productId: string
  ): void {

    this.cartService
      .decreaseQuantity(productId);

  }


  removeProduct(
    productId: string
  ): void {

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

    const confirmed =
      window.confirm(

        this.translate(
          'Remove all products from your cart?',
          'உங்கள் கார்ட்டிலுள்ள அனைத்து பொருட்களையும் நீக்க வேண்டுமா?',
          'क्या आप अपने कार्ट से सभी उत्पाद हटाना चाहते हैं?'
        )

      );


    if (confirmed) {

      this.cartService.clearCart();

      this.showCheckoutForm = false;

      this.checkoutMessage = '';

      this.checkoutError = '';

      this.orderPlaced = false;

    }

  }


  /*
   * =====================================================
   * PRODUCT NAME
   * =====================================================
   */

  getProductName(
    item: CartItem
  ): string {

    if (this.language === 'ta') {

      return (
        item.product.name.ta ||
        item.product.name.en
      );

    }


    if (this.language === 'hi') {

      return (
        item.product.name.hi ||
        item.product.name.en
      );

    }


    return item.product.name.en;

  }


  /*
   * Secondary product name
   */

  getSecondaryName(
    item: CartItem
  ): string {

    /*
     * Tamil selected:
     * Tamil main + English secondary
     */
    if (this.language === 'ta') {

      return item.product.name.en;

    }


    /*
     * Hindi selected:
     * Hindi main + English secondary
     */
    if (this.language === 'hi') {

      return item.product.name.en;

    }


    /*
     * English selected:
     * English main + Tamil secondary
     */
    return (
      item.product.name.ta ||
      item.product.name.hi ||
      ''
    );

  }


  /*
   * =====================================================
   * ITEM TOTAL
   * =====================================================
   */

  getItemTotal(
    item: CartItem
  ): number {

    return (
      item.product.price *
      item.quantity
    );

  }


  /*
   * =====================================================
   * TRACK BY
   * =====================================================
   */

  trackCartItem(
    _index: number,
    item: CartItem
  ): string {

    return item.product._id;

  }


  /*
   * =====================================================
   * LANGUAGE HELPER
   * =====================================================
   */

  private translate(
    english: string,
    tamil: string,
    hindi: string
  ): string {

    if (this.language === 'ta') {
      return tamil;
    }

    if (this.language === 'hi') {
      return hindi;
    }

    return english;

  }

}