import {
  Inject,
  Injectable,
  PLATFORM_ID
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

import {
  BehaviorSubject,
  map
} from 'rxjs';

import {
  Product
} from './product';


export interface CartItem {
  product: Product;
  quantity: number;
}


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly storageKey = 'meenakshi_cart';

  private readonly cartItemsSubject =
    new BehaviorSubject<CartItem[]>([]);


  readonly cartItems$ =
    this.cartItemsSubject.asObservable();


 readonly cartCount$ =
  this.cartItems$.pipe(
    map(items => items.length)
  );


  readonly cartTotal$ =
    this.cartItems$.pipe(
      map(items =>
        items.reduce(
          (total, item) =>
            total +
            item.product.price * item.quantity,
          0
        )
      )
    );


  constructor(
    @Inject(PLATFORM_ID)
    private platformId: object
  ) {
    this.loadCart();
  }


  addProduct(product: Product): void {
    const items = [...this.cartItemsSubject.value];

    const existingItem = items.find(
      item => item.product._id === product._id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({
        product,
        quantity: 1
      });
    }

    this.updateCart(items);
  }


  increaseQuantity(productId: string): void {
    const items = this.cartItemsSubject.value.map(
      item => {
        if (item.product._id === productId) {
          return {
            ...item,
            quantity: item.quantity + 1
          };
        }

        return item;
      }
    );

    this.updateCart(items);
  }


  decreaseQuantity(productId: string): void {
    const items = this.cartItemsSubject.value.map(
      item => {
        if (
          item.product._id === productId &&
          item.quantity > 1
        ) {
          return {
            ...item,
            quantity: item.quantity - 1
          };
        }

        return item;
      }
    );

    this.updateCart(items);
  }


  removeProduct(productId: string): void {
    const items = this.cartItemsSubject.value.filter(
      item => item.product._id !== productId
    );

    this.updateCart(items);
  }


  clearCart(): void {
    this.updateCart([]);
  }


  getProductQuantity(productId: string): number {
    const item = this.cartItemsSubject.value.find(
      cartItem =>
        cartItem.product._id === productId
    );

    return item?.quantity || 0;
  }


  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }
  syncWithProducts(products: Product[]): void {
  const availableProducts = new Map(
    products.map(product => [
      product._id,
      product
    ])
  );

  const validCartItems =
    this.cartItemsSubject.value
      .filter(item =>
        availableProducts.has(item.product._id)
      )
      .map(item => ({
        ...item,
        product: availableProducts.get(
          item.product._id
        )!
      }));

  this.updateCart(validCartItems);
}

  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(items)
      );
    }
  }


  private loadCart(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const savedCart =
        localStorage.getItem(this.storageKey);

      if (!savedCart) {
        return;
      }

      const items =
        JSON.parse(savedCart) as CartItem[];

      if (Array.isArray(items)) {
        this.cartItemsSubject.next(items);
      }
    } catch {
      localStorage.removeItem(this.storageKey);
      this.cartItemsSubject.next([]);
    }
  }
}