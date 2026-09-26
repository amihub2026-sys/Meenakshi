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
import { CreateOrderData } from '../../services/order';
import { OrderService } from '../../services/order.service';


type DeliveryType = 'LOCAL' | 'DISTRICT' | 'STATE';

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

  showPaymentModal = false;
  showDeliverySummary = false;
  paymentProcessing = false;

  private pendingOrderData: CreateOrderData | null = null;
  private pendingCheckoutForm: NgForm | null = null;

  showCheckoutForm = false;
  submittingOrder = false;
  orderPlaced = false;
  showLoginModal = false;
  loginSnackbarVisible = false;

  placedOrderId = '';
  checkoutMessage = '';
  checkoutError = '';

  // Delivery calculation state
  deliveryType: DeliveryType = 'LOCAL';
  productTotal = 0;
  deliveryCharge = 0;
  finalAmount = 0;
  totalShippingWeightKg = 0;
  requiresWhatsapp = false;
  shippingWeightNeedsConfirmation = false;

  // CURRENT LOCAL RULE:
  // Madurai district + Tamil Nadu = Local Area = FREE delivery.
  // If your local area is based on specific pincodes later,
  // change only getDeliveryType().
  private readonly LOCAL_DISTRICT = 'madurai';

  // Replace this with the shop WhatsApp number in international format.
  // Example: 919876543210
  private readonly STORE_WHATSAPP = '91XXXXXXXXXX';

  customerForm = {
    name: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    state: '',
    pincode: ''
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
    if (this.submittingOrder || this.paymentProcessing) {
      return;
    }

    this.showCheckoutForm = false;
    this.showDeliverySummary = false;
    this.showPaymentModal = false;
    this.checkoutMessage = '';
    this.checkoutError = '';
  }

  /**
   * STEP 1
   * Delivery form submit.
   * This DOES NOT create the order and DOES NOT open payment directly.
   * It calculates the delivery charge and opens the delivery summary popup.
   */
  submitCheckout(form: NgForm): void {
    this.checkoutMessage = '';
    this.checkoutError = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.submittingOrder || this.paymentProcessing) {
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

    // Save the complete delivery address into the existing backend address field.
    // This avoids breaking the current CreateOrderData interface/backend today.
    const fullAddress = [
      this.customerForm.address.trim(),
      this.customerForm.district.trim(),
      this.customerForm.state.trim(),
      this.customerForm.pincode.trim()
    ]
      .filter(Boolean)
      .join(', ');
const orderData: CreateOrderData = {

  customerName:
    this.customerForm.name.trim(),

  phone:
    this.customerForm.phone.trim(),

  address:
    this.customerForm.address.trim(),

  district:
    this.customerForm.district.trim(),

  state:
    this.customerForm.state.trim(),

  pincode:
    this.customerForm.pincode.trim(),

  items: availableCartItems.map(
    (item: CartItem) => ({

      productId:
        item.product._id,

      quantity:
        item.quantity,

      variantQuantity:
        item.selectedVariant.quantity,

      variantUnit:
        item.selectedVariant.unit

    })
  )
};

    const email = this.customerForm.email.trim();

    if (email) {
      orderData.email = email;
    }

    // Keep order data temporarily.
    // The order is created only after the payment step succeeds.
    this.pendingOrderData = orderData;
    this.pendingCheckoutForm = form;

    // Product subtotal from the active items in the cart.
    this.productTotal = availableCartItems.reduce(
      (total: number, item: CartItem) =>
        total + item.selectedVariant.price * item.quantity,
      0
    );

    // Calculate total shipping weight from selected variants.
    this.totalShippingWeightKg =
      this.calculateTotalShippingWeight(availableCartItems);

    // Decide Local / Other District / Other State.
    this.deliveryType = this.getDeliveryType(
      this.customerForm.district,
      this.customerForm.state
    );

    // Apply your delivery price rules.
    this.calculateDeliveryCharge();

    this.finalAmount =
      this.productTotal + this.deliveryCharge;

    // STEP 2: show delivery-charge popup.
    this.showDeliverySummary = true;
    this.showPaymentModal = false;
  }

  /**
   * Convert selected variant quantities into a shipping-weight total.
   * Current conversion used for delivery slabs:
   * 1000 g = 1 kg
   * 1000 ml = 1 kg shipping equivalent
   * 1 litre = 1 kg shipping equivalent
   */
 private calculateTotalShippingWeight(
  items: CartItem[]
): number {

  this.shippingWeightNeedsConfirmation = false;

  let totalKg = 0;

  for (const item of items) {

    const shippingWeightKg =
      Number(
        item.selectedVariant.shippingWeightKg
      );

    if (
      !Number.isFinite(shippingWeightKg) ||
      shippingWeightKg <= 0
    ) {

      this.shippingWeightNeedsConfirmation = true;

      continue;
    }

    totalKg +=
      shippingWeightKg *
      Number(item.quantity);

  }

  return Number(
    totalKg.toFixed(3)
  );
}

  /**
   * CURRENT LOCATION RULE:
   * Madurai district + Tamil Nadu => Local Area
   * Another Tamil Nadu district => Other District
   * Outside Tamil Nadu => Other State
   */
  private getDeliveryType(
    district: string,
    state: string
  ): DeliveryType {
    const normalizedDistrict = district
      .trim()
      .toLowerCase();

    const normalizedState = state
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    const isTamilNadu = [
      'tamil nadu',
      'tamilnadu',
      'tn'
    ].includes(normalizedState);

    if (
      isTamilNadu &&
      normalizedDistrict === this.LOCAL_DISTRICT
    ) {
      return 'LOCAL';
    }

    if (isTamilNadu) {
      return 'DISTRICT';
    }

    return 'STATE';
  }

  /**
   * DELIVERY RULES
   * LOCAL AREA: FREE
   * OTHER DISTRICT:
   *   <= 1kg : 80
   *   <= 2kg : 150
   *   <= 3kg : 230
   *   > 3kg  : WhatsApp
   * OTHER STATE:
   *   <= 1kg : 110
   *   <= 2kg : 200
   *   > 2kg  : WhatsApp
   */
  private calculateDeliveryCharge(): void {
    const weight = this.totalShippingWeightKg;

    this.deliveryCharge = 0;
    this.requiresWhatsapp = false;

    // If the product unit cannot be converted safely,
    // ask the customer to contact the shop instead of guessing.
    if (this.shippingWeightNeedsConfirmation) {
      this.requiresWhatsapp = true;
      return;
    }

    // LOCAL AREA = FREE DELIVERY, no weight restriction.
    if (this.deliveryType === 'LOCAL') {
      this.deliveryCharge = 0;
      return;
    }

    // OTHER DISTRICT
    if (this.deliveryType === 'DISTRICT') {
      if (weight <= 1) {
        this.deliveryCharge = 80;
      } else if (weight <= 2) {
        this.deliveryCharge = 150;
      } else if (weight <= 3) {
        this.deliveryCharge = 230;
      } else {
        this.requiresWhatsapp = true;
      }

      return;
    }

    // OTHER STATE
    if (weight <= 1) {
      this.deliveryCharge = 110;
    } else if (weight <= 2) {
      this.deliveryCharge = 200;
    } else {
      this.requiresWhatsapp = true;
    }
  }

  /**
   * STEP 2 -> STEP 3
   * Only normal delivery orders can continue to payment.
   */
  continueToPayment(): void {
    if (
      this.requiresWhatsapp ||
      !this.pendingOrderData
    ) {
      return;
    }

    this.showDeliverySummary = false;
    this.showPaymentModal = true;
  }

  closeDeliverySummary(): void {
    if (this.paymentProcessing) {
      return;
    }

    this.showDeliverySummary = false;
  }

  get deliveryTypeLabel(): string {
    if (this.deliveryType === 'LOCAL') {
      return 'Local Area';
    }

    if (this.deliveryType === 'DISTRICT') {
      return 'Other District';
    }

    return 'Other State';
  }

  contactStoreWhatsApp(): void {
    if (this.STORE_WHATSAPP.includes('X')) {
      this.checkoutError =
        'Please add the store WhatsApp number in cart.ts before using WhatsApp checkout.';
      return;
    }

    const cartItemsText = this.getAvailableCartItems()
      .map(
        (item: CartItem) =>
          `${item.product.name.en} - ${item.selectedVariant.quantity}${item.selectedVariant.unit} x ${item.quantity}`
      )
      .join('\n');

    const message = [
      'Hello, I want to place an order.',
      '',
      `Name: ${this.customerForm.name}`,
      `Phone: ${this.customerForm.phone}`,
      `Address: ${this.customerForm.address}`,
      `District: ${this.customerForm.district}`,
      `State: ${this.customerForm.state}`,
      `Pincode: ${this.customerForm.pincode}`,
      '',
      'Products:',
      cartItemsText,
      '',
      `Product Total: ₹${this.productTotal}`,
      `Shipping Weight: ${this.totalShippingWeightKg} kg`,
      '',
      'Please confirm the delivery charge.'
    ].join('\n');

    const whatsappUrl =
      `https://wa.me/${this.STORE_WHATSAPP}` +
      `?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappUrl,
      '_blank',
      'noopener,noreferrer'
    );
  }

  /**
   * STEP 3
   * Existing test-payment flow.
   * The backend order is created only after this succeeds.
   */
simulatePayment(): void {

  if (
    !this.pendingOrderData ||
    this.paymentProcessing
  ) {
    return;
  }


  this.paymentProcessing = true;
  this.submittingOrder = true;


  this.orderService
    .createOrder(
      this.pendingOrderData
    )
    .subscribe({

      next: response => {

        /* =========================
           PAYMENT / ORDER SUCCESS
        ========================= */

        this.paymentProcessing = false;
        this.submittingOrder = false;

        this.showPaymentModal = false;
        this.showDeliverySummary = false;
        this.showCheckoutForm = false;

        this.orderPlaced = true;


        this.placedOrderId =
          response.order?._id || '';


        this.checkoutMessage =
          this.translate(

            'Test payment successful. Order placed successfully.',

            'டெஸ்ட் பேமெண்ட் வெற்றிகரமாக முடிந்தது. உங்கள் ஆர்டர் பதிவு செய்யப்பட்டது.',

            'टेस्ट पेमेंट सफल रहा। आपका ऑर्डर दर्ज हो गया।'

          );


        /* =========================
           CLEAR SAVED MONGODB CART
           + LOCAL BROWSER CART
        ========================= */

        this.cartService
          .clearUserCart()
          .subscribe({

            next: () => {

              // MongoDB cart cleared
              // Now clear browser/localStorage cart
              this.cartService
                .clearLocalCart();

            },


            error: error => {

              console.error(
                'Order placed successfully, but saved cart could not be cleared:',
                error
              );


              /*
                Order already exists successfully.

                Even if backend cart clearing fails,
                clear the browser cart so the customer
                does not see purchased items again.
              */

              this.cartService
                .clearLocalCart();

            }

          });


        /* =========================
           CLEAR CUSTOMER FORM
        ========================= */

        this.customerForm = {

          name: '',

          phone: '',

          email: '',

          address: '',

          district: '',

          state: '',

          pincode: ''

        };


        /* =========================
           RESET ANGULAR FORM
        ========================= */

        this.pendingCheckoutForm
          ?.resetForm();


        /* =========================
           CLEAR TEMPORARY ORDER DATA
        ========================= */

        this.pendingOrderData = null;

        this.pendingCheckoutForm = null;


        /* =========================
           RESET DELIVERY DATA
        ========================= */

        this.resetDeliveryState();


        /* =========================
           SCROLL TOP
        ========================= */

        setTimeout(() => {

          window.scrollTo({

            top: 0,

            behavior: 'smooth'

          });

        });

      },


      error: error => {

        /* =========================
           PAYMENT / ORDER FAILED
        ========================= */

        this.paymentProcessing = false;

        this.submittingOrder = false;


        console.error(

          'Test payment / order error:',

          error

        );


        /* =========================
           SHOW BACKEND ERROR IN ENGLISH
        ========================= */

        if (

          this.language === 'en' &&

          error?.error?.message

        ) {

          this.checkoutError =
            error.error.message;

        }

        else {

          this.checkoutError =
            this.translate(

              'Unable to complete the test payment. Please try again.',

              'டெஸ்ட் பேமெண்ட்டை முடிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',

              'टेस्ट पेमेंट पूरा नहीं हो सका। कृपया फिर से प्रयास करें।'

            );

        }


        this.showPaymentModal = false;

      }

    });

}/* =========================================================
   CUSTOMER DOWNLOAD ORDER BILL
========================================================= */

downloadBill(): void {

  if (!this.placedOrderId) {
    return;
  }

  this.orderService
    .downloadBill(this.placedOrderId)
    .subscribe({

      next: (pdfBlob: Blob) => {

        const blobUrl =
          window.URL.createObjectURL(pdfBlob);

        const link =
          document.createElement('a');

        link.href = blobUrl;

        link.download =
          `meenakshi-bill-${this.placedOrderId}.pdf`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
      },

      error: (error: unknown) => {

        console.error(
          'Unable to download bill:',
          error
        );

      }

    });

}

  private resetDeliveryState(): void {
    this.deliveryType = 'LOCAL';
    this.productTotal = 0;
    this.deliveryCharge = 0;
    this.finalAmount = 0;
    this.totalShippingWeightKg = 0;
    this.requiresWhatsapp = false;
    this.shippingWeightNeedsConfirmation = false;
    
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
              this.cartService.mergeGuestCart();
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
      this.showDeliverySummary = false;
      this.showPaymentModal = false;
      this.checkoutMessage = '';
      this.checkoutError = '';
      this.pendingOrderData = null;
      this.pendingCheckoutForm = null;
      this.resetDeliveryState();
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
    this.showDeliverySummary = false;
    this.showPaymentModal = false;
    this.checkoutMessage = '';
    this.checkoutError = '';
    this.orderPlaced = false;
    this.placedOrderId = '';
    this.pendingOrderData = null;
    this.pendingCheckoutForm = null;
    this.resetDeliveryState();
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

    return item.selectedVariant.price * item.quantity;
  }

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
