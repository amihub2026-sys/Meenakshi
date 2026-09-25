import {
  Inject,
  Injectable,
  PLATFORM_ID
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

import {
  HttpClient
} from '@angular/common/http';

import {
  BehaviorSubject,
  map,
  Observable
} from 'rxjs';

import {
  environment
} from '../../environments/environment';

import {
  Product
} from './product';


export interface CartItem {

  product: Product;

  selectedVariant: {
    quantity: number;

    unit:
      | 'g'
      | 'kg'
      | 'ml'
      | 'l'
      | 'piece'
      | 'packet'
      | 'box';

    price: number;
  };

  quantity: number;
}


interface BackendCartItem {
  product: Product;

  selectedVariant: CartItem['selectedVariant'];

  quantity: number;
}


interface BackendCartResponse {
  success: boolean;
  items: BackendCartItem[];
}


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly storageKey =
    'meenakshi_cart';

  private readonly apiUrl =
    `${environment.apiUrl}/cart`;

  private readonly cartItemsSubject =
    new BehaviorSubject<CartItem[]>([]);


  readonly cartItems$ =
    this.cartItemsSubject.asObservable();


  readonly cartCount$ =
    this.cartItems$.pipe(
      map(items =>
        items.reduce(
          (count, item) =>
            count + item.quantity,
          0
        )
      )
    );


  readonly cartTotal$ =
    this.cartItems$.pipe(
      map(items =>
        items.reduce(
          (total, item) =>
            total +
            item.selectedVariant.price *
            item.quantity,
          0
        )
      )
    );


  constructor(

    @Inject(PLATFORM_ID)
    private platformId: object,

    private http: HttpClient

  ) {

    this.loadLocalCart();

  }


  /* =====================================================
     ADD PRODUCT
  ===================================================== */

  addProduct(

    product: Product,

    selectedVariant:
      CartItem['selectedVariant']

  ): void {

    const items =
      [...this.cartItemsSubject.value];


    const existingItem =
      items.find(
        item =>

          item.product._id ===
            product._id

          &&

          item.selectedVariant.quantity ===
            selectedVariant.quantity

          &&

          item.selectedVariant.unit ===
            selectedVariant.unit

          &&

          item.selectedVariant.price ===
            selectedVariant.price
      );


    if (existingItem) {

      existingItem.quantity += 1;

    } else {

      items.push({

        product,

        selectedVariant,

        quantity: 1

      });

    }


    this.updateLocalCart(items);

  }


  /* =====================================================
     INCREASE
  ===================================================== */

  increaseQuantity(
    productId: string
  ): void {

    const items =
      this.cartItemsSubject.value.map(
        item => {

          if (
            item.product._id ===
            productId
          ) {

            return {
              ...item,

              quantity:
                item.quantity + 1
            };

          }


          return item;

        }
      );


    this.updateLocalCart(items);

  }


  /* =====================================================
     DECREASE
  ===================================================== */

  decreaseQuantity(
    productId: string
  ): void {

    const items =
      this.cartItemsSubject.value.map(
        item => {

          if (
            item.product._id ===
              productId

            &&

            item.quantity > 1
          ) {

            return {

              ...item,

              quantity:
                item.quantity - 1

            };

          }


          return item;

        }
      );


    this.updateLocalCart(items);

  }


  /* =====================================================
     CHANGE VARIANT
  ===================================================== */

  changeVariant(

    productId: string,

    selectedVariant:
      CartItem['selectedVariant']

  ): void {

    const items =
      this.cartItemsSubject.value.map(
        item => {

          if (
            item.product._id ===
            productId
          ) {

            return {

              ...item,

              selectedVariant

            };

          }


          return item;

        }
      );


    this.updateLocalCart(items);

  }


  /* =====================================================
     REMOVE PRODUCT
  ===================================================== */

  removeProduct(
    productId: string
  ): void {

    const items =
      this.cartItemsSubject.value.filter(
        item =>
          item.product._id !==
          productId
      );


    this.updateLocalCart(items);

  }


  /* =====================================================
     CLEAR LOCAL ONLY
     USE THIS ON LOGOUT
  ===================================================== */

  clearLocalCart(): void {

    this.cartItemsSubject.next([]);


    if (
      isPlatformBrowser(
        this.platformId
      )
    ) {

      localStorage.removeItem(
        this.storageKey
      );

    }

  }


  /* =====================================================
     CLEAR CUSTOMER CART
     USE AFTER SUCCESSFUL ORDER
  ===================================================== */

  clearUserCart():
    Observable<{
      success: boolean;
      message: string;
    }> {

    return this.http.delete<{
      success: boolean;
      message: string;
    }>(

      `${this.apiUrl}/my`,

      {
        withCredentials: true
      }

    );

  }


  /* =====================================================
     CLEAR BOTH
  ===================================================== */

  clearCart(): void {

    this.clearLocalCart();

  }


  /* =====================================================
     GET PRODUCT QUANTITY
  ===================================================== */

  getProductQuantity(
    productId: string
  ): number {

    const item =
      this.cartItemsSubject.value.find(
        cartItem =>
          cartItem.product._id ===
          productId
      );


    return item?.quantity || 0;

  }


  /* =====================================================
     GET CURRENT CART
  ===================================================== */

  getCartItems():
    CartItem[] {

    return this.cartItemsSubject.value;

  }


  /* =====================================================
     SYNC WITH LATEST PRODUCTS
  ===================================================== */

  syncWithProducts(
    products: Product[]
  ): void {

    const availableProducts =
      new Map(

        products.map(
          product => [

            product._id,

            product

          ]
        )

      );


    const validCartItems =
      this.cartItemsSubject.value

        .filter(
          item =>
            availableProducts.has(
              item.product._id
            )
        )

        .map(
          item => ({

            ...item,

            product:
              availableProducts.get(
                item.product._id
              )!

          })
        );


    this.updateLocalCart(
      validCartItems
    );

  }


  /* =====================================================
     LOAD USER CART FROM MONGODB
  ===================================================== */

  loadUserCart(): void {

    this.http
      .get<BackendCartResponse>(

        `${this.apiUrl}/my`,

        {
          withCredentials: true
        }

      )
      .subscribe({

        next: response => {

          const items =
            response.items || [];


          this.updateLocalCart(
            items
          );

        },


        error: error => {

          console.error(
            'Unable to load user cart:',
            error
          );

        }

      });

  }


  /* =====================================================
     MERGE GUEST CART AFTER LOGIN
  ===================================================== */

  mergeGuestCart(): void {

    const guestItems =
      this.cartItemsSubject.value;


    const payload = {

      items:
        guestItems.map(
          item => ({

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


    this.http
      .post<BackendCartResponse>(

        `${this.apiUrl}/merge`,

        payload,

        {
          withCredentials: true
        }

      )
      .subscribe({

        next: response => {

          this.updateLocalCart(
            response.items || []
          );

        },


        error: error => {

          console.error(
            'Unable to merge cart:',
            error
          );

        }

      });

  }


  /* =====================================================
     SAVE CURRENT CART TO MONGODB
  ===================================================== */

  saveUserCart(): void {

    const items =
      this.cartItemsSubject.value;


    const payload = {

      items:
        items.map(
          item => ({

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


    this.http
      .put<BackendCartResponse>(

        this.apiUrl,

        payload,

        {
          withCredentials: true
        }

      )
      .subscribe({

        next: response => {

          this.updateLocalCart(
            response.items || []
          );

        },


        error: error => {

          /*
            401 is normal for guest users.
            Guest cart remains local only.
          */

          if (
            error?.status !== 401
          ) {

            console.error(
              'Unable to save user cart:',
              error
            );

          }

        }

      });

  }


  /* =====================================================
     LOCAL CART UPDATE
  ===================================================== */

  private updateLocalCart(
    items: CartItem[]
  ): void {

    this.cartItemsSubject.next(
      items
    );


    if (
      isPlatformBrowser(
        this.platformId
      )
    ) {

      localStorage.setItem(

        this.storageKey,

        JSON.stringify(items)

      );

    }

  }


  /* =====================================================
     LOAD LOCAL CART
  ===================================================== */

  private loadLocalCart(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {

      return;

    }


    try {

      const savedCart =
        localStorage.getItem(
          this.storageKey
        );


      if (!savedCart) {

        return;

      }


      const items =
        JSON.parse(
          savedCart
        ) as CartItem[];


      if (
        Array.isArray(items)
      ) {

        this.cartItemsSubject.next(
          items
        );

      }

    }

    catch {

      localStorage.removeItem(
        this.storageKey
      );

      this.cartItemsSubject.next(
        []
      );

    }

  }

}