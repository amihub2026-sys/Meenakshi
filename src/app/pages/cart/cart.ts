import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { UserAuthService } from '../../services/user-auth.service';
import { environment } from '../../../environments/environment';
import { Product, ProductService } from '../../services/product';
import { CartItem, CartService } from '../../services/cart';
import { Language, LanguageService } from '../../services/language.service';
import { CreateOrderData, OrderService } from '../../services/order';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {

  private readonly cartService = inject(CartService);
  private readonly languageService = inject(LanguageService);
  private readonly orderService = inject(OrderService);
  private readonly productService = inject(ProductService);
   private readonly userAuthService = inject(UserAuthService);
  readonly cartItems$: Observable<CartItem[]> = this.cartService.cartItems$;

  readonly cartCount$: Observable<number> = this.cartItems$.pipe(
    map((items: CartItem[]) =>
      items
        .filter((item: CartItem) => item.product.isActive)
        .reduce(
          (count: number, item: CartItem) => count + item.quantity,
          0
        )
    )
  );

  readonly cartTotal$: Observable<number> = this.cartItems$.pipe(
    map((items: CartItem[]) =>
      items
        .filter((item: CartItem) => item.product.isActive)
        .reduce(
          (total: number, item: CartItem) =>
          total + item.selectedVariant.price * item.quantity,
          0
        )
    )
  );

  language: Language = 'ta';

  showCheckoutForm = false;
  submittingOrder = false;
  orderPlaced = false;
showLoginModal = false;
loginSnackbarVisible = false;
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
    const cartItems = this.cartService.getCartItems();

    if (cartItems.length === 0) {
      return;
    }

    const productIds = cartItems.map(
      (item: CartItem) => item.product._id
    );

    this.productService
      .validateCartProducts(productIds)
      .subscribe({
        next: (products: Product[]) => {
          this.cartService.syncWithProducts(products);
        },

        error: (error: unknown) => {
          console.error(
            'Unable to validate cart products:',
            error
          );
        }
      });
  }

  private getAvailableCartItems(): CartItem[] {
    return this.cartService
      .getCartItems()
      .filter(
        (item: CartItem) => item.product.isActive
      );
  }

  hasOutOfStockProducts(): boolean {
    return this.getAvailableCartItems().length === 0;
  }

  openCheckoutForm(): void {
    const availableItems = this.getAvailableCartItems();

    if (availableItems.length === 0) {
      this.checkoutError = this.translate(
        'There are no available products to checkout.',
        'ஆர்டர் செய்ய கையிருப்பில் உள்ள பொருட்கள் இல்லை.',
        'ऑर्डर करने के लिए कोई उत्पाद स्टॉक में नहीं है।'
      );

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

    const cartItems = this.cartService.getCartItems();

    if (cartItems.length === 0) {
      this.checkoutError = this.translate(
        'Your cart is empty. Please add a product.',
        'உங்கள் கார்ட் காலியாக உள்ளது. ஒரு பொருளைச் சேர்க்கவும்.',
        'आपका कार्ट खाली है। कृपया एक उत्पाद जोड़ें।'
      );

      return;
    }

    const availableCartItems = this.getAvailableCartItems();

    if (availableCartItems.length === 0) {
      this.checkoutError = this.translate(
        'There are no available products to checkout.',
        'ஆர்டர் செய்ய கையிருப்பில் உள்ள பொருட்கள் இல்லை.',
        'ऑर्डर करने के लिए कोई उत्पाद स्टॉक में नहीं है।'
      );

      return;
    }

    const orderData: CreateOrderData = {
      customerName: this.customerForm.name.trim(),
      phone: this.customerForm.phone.trim(),
      address: this.customerForm.address.trim(),

      items: availableCartItems.map(
        (item: CartItem) => ({
          productId: item.product._id,
          quantity: item.quantity
        })
      )
    };

    const email = this.customerForm.email.trim();

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

          this.placedOrderId = response.order?._id || '';

          if (this.language === 'en') {
            this.checkoutMessage =
              response.message ||
              'Order placed successfully.';
          } else {
            this.checkoutMessage = this.translate(
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

          if (
            this.language === 'en' &&
            error?.error?.message
          ) {
            this.checkoutError = error.error.message;
          } else {
            this.checkoutError = this.translate(
              'Unable to place your order. Please try again.',
              'உங்கள் ஆர்டரை பதிவு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
              'आपका ऑर्डर नहीं किया जा सका। कृपया फिर से प्रयास करें।'
            );
          }
        }
      });
  }
private renderGoogleButton(): void {
  const google = (window as any).google;

  if (!google?.accounts?.id) {
    console.error('Google Identity Services not loaded');
    return;
  }

  const buttonContainer =
    document.getElementById('google-signin-button');

  if (!buttonContainer) {
    return;
  }

  buttonContainer.innerHTML = '';

  google.accounts.id.initialize({
    client_id: environment.googleClientId,

    callback: (response: any) => {
      const credential = response?.credential;

      if (!credential) {
        console.error('Google credential not received');
        return;
      }

      this.userAuthService
        .googleLogin(credential)
        .subscribe({
          next: result => {
            

            window.localStorage.setItem(
              'user',
              JSON.stringify(result.user)
            );
  window.dispatchEvent(
  new CustomEvent('user-login-success')
);
            this.showLoginModal = false;

            this.customerForm.name =
              result.user.name || '';

            this.customerForm.email =
              result.user.email || '';

            this.openCheckoutForm();
          },

          error: error => {
            console.error(
              'Google login failed:',
              error
            );
          }
        });
    }
  });

  google.accounts.id.renderButton(
    buttonContainer,
    {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      width: 280
    }
  );
}
handleCheckout(): void {
  this.userAuthService
    .getCurrentUser()
    .subscribe({
      next: () => {
        this.openCheckoutForm();
      },

      error: () => {
        this.showLoginSnackbar();
        this.showLoginModal = true;

        setTimeout(() => {
          this.renderGoogleButton();
        });
      }
    });
}
showLoginSnackbar(): void {

  this.loginSnackbarVisible = true;

  setTimeout(() => {
    this.loginSnackbarVisible = false;
  }, 3000);
}
closeLoginModal(): void {
  this.showLoginModal = false;
}
  increaseQuantity(productId: string): void {
    const item = this.cartService
      .getCartItems()
      .find(
        (cartItem: CartItem) =>
          cartItem.product._id === productId
      );

    if (!item || !item.product.isActive) {
      return;
    }

    this.cartService.increaseQuantity(productId);
  }

  decreaseQuantity(productId: string): void {
    const item = this.cartService
      .getCartItems()
      .find(
        (cartItem: CartItem) =>
          cartItem.product._id === productId
      );

    if (!item || !item.product.isActive) {
      return;
    }

    this.cartService.decreaseQuantity(productId);
  }
changeVariant(
  item: CartItem,
  variant: CartItem['selectedVariant']
): void {

  if (!item.product.isActive) {
    return;
  }

  this.cartService.changeVariant(
    item.product._id,
    variant
  );
}

  removeProduct(productId: string): void {
    this.cartService.removeProduct(productId);

    if (this.cartService.getCartItems().length === 0) {
      this.showCheckoutForm = false;
      this.checkoutMessage = '';
      this.checkoutError = '';
    }
  }

  clearCart(): void {
    const confirmed = window.confirm(
      this.translate(
        'Remove all products from your cart?',
        'உங்கள் கார்ட்டிலுள்ள அனைத்து பொருட்களையும் நீக்க வேண்டுமா?',
        'क्या आप अपने कार्ट से सभी उत्पाद हटाना चाहते हैं?'
      )
    );

    if (!confirmed) {
      return;
    }

    this.cartService.clearCart();
    this.showCheckoutForm = false;
    this.checkoutMessage = '';
    this.checkoutError = '';
    this.orderPlaced = false;
    this.placedOrderId = '';
  }

  getProductName(item: CartItem): string {
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

  getSecondaryName(item: CartItem): string {
    if (this.language === 'ta') {
      return item.product.name.en;
    }

    if (this.language === 'hi') {
      return item.product.name.en;
    }

    return (
      item.product.name.ta ||
      item.product.name.hi ||
      ''
    );
  }

  getItemTotal(item: CartItem): number {
    if (!item.product.isActive) {
      return 0;
    }

  return item.selectedVariant.price * item.quantity;  }

  trackCartItem(
    _index: number,
    item: CartItem
  ): string {
    return item.product._id;
  }

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
