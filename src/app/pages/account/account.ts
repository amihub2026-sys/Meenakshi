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
  UserAuthService
} from '../../services/user-auth.service';

import {
  CustomerOrder,
  OrderItem,
  OrderService,
  OrderStatus
} from '../../services/order';

import {
  Language,
  LanguageService
} from '../../services/language.service';


@Component({
  selector: 'app-account',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './account.html',

  styleUrl: './account.css'
})
export class AccountComponent implements OnInit {

  private readonly userAuthService =
    inject(UserAuthService);

  private readonly orderService =
    inject(OrderService);

  private readonly languageService =
    inject(LanguageService);


  language: Language = 'ta';


  loading = true;

  errorMessage = '';


  user: {

    id: string;

    name: string;

    email: string;

    picture: string;

    provider: string;

    lastLoginAt: string | null;

  } | null = null;


  orders: CustomerOrder[] = [];

  ordersLoading = false;

  ordersError = '';


  orderSteps: OrderStatus[] = [
    'confirmed',
    'shipped',
    'out_for_delivery',
    'delivered'
  ];


  constructor() {

    this.languageService
      .language$
      .subscribe(language => {

        this.language = language;

      });
  }


  ngOnInit(): void {

    this.loadAccount();

  }


  loadAccount(): void {

    this.loading = true;

    this.errorMessage = '';


    this.userAuthService
      .getCurrentUser()
      .subscribe({

        next: response => {

          this.user =
            response.user;

          this.loading = false;

          this.loadOrders();

        },


        error: () => {

          this.user = null;

          this.loading = false;

          this.errorMessage =
            this.t(
              'Unable to load your account details.',
              'உங்கள் கணக்கு விவரங்களை ஏற்ற முடியவில்லை.',
              'आपके खाते का विवरण लोड नहीं किया जा सका।'
            );

        }

      });

  }


  loadOrders(): void {

    this.ordersLoading = true;

    this.ordersError = '';


    this.orderService
      .getMyOrders()
      .subscribe({

        next: response => {

          this.orders =
            response.orders || [];

          this.ordersLoading = false;

        },


        error: error => {

          console.error(
            'Unable to load customer orders:',
            error
          );

          this.orders = [];

          this.ordersLoading = false;

          this.ordersError =
            this.t(
              'Unable to load your orders.',
              'உங்கள் ஆர்டர்களை ஏற்ற முடியவில்லை.',
              'आपके ऑर्डर लोड नहीं किए जा सके।'
            );

        }

      });

  }


  /* =====================================================
     PRODUCT NAME LANGUAGE
  ===================================================== */

  getProductName(
    item: OrderItem
  ): string {

    if (
      this.language === 'ta'
    ) {

      return (
        item.productNameTa ||
        item.productName
      );

    }


    if (
      this.language === 'hi'
    ) {

      return (
        item.productNameHi ||
        item.productName
      );

    }


    return item.productName;

  }


  /* =====================================================
     STATUS RANK
  ===================================================== */

  private getStatusRank(
    status: OrderStatus
  ): number {

    const ranking:
      Record<OrderStatus, number> = {

      new: 0,

      confirmed: 1,

      shipped: 2,

      out_for_delivery: 3,

      delivered: 4,

      cancelled: -1

    };


    return ranking[status];

  }


  isStepCompleted(
    orderStatus: OrderStatus,
    stepStatus: OrderStatus
  ): boolean {

    if (
      orderStatus === 'cancelled'
    ) {

      return false;

    }


    return (

      this.getStatusRank(
        orderStatus
      )

      >=

      this.getStatusRank(
        stepStatus
      )

    );

  }


  isCurrentStep(
    orderStatus: OrderStatus,
    stepStatus: OrderStatus
  ): boolean {

    return (
      orderStatus ===
      stepStatus
    );

  }


  /* =====================================================
     STATUS TRANSLATION
  ===================================================== */

  getStatusLabel(
    status: OrderStatus
  ): string {

    switch (status) {

      case 'new':

        return this.t(
          'New',
          'புதியது',
          'नया'
        );


      case 'confirmed':

        return this.t(
          'Confirmed',
          'உறுதிப்படுத்தப்பட்டது',
          'पुष्टि की गई'
        );


      case 'shipped':

        return this.t(
          'Shipped',
          'அனுப்பப்பட்டது',
          'भेज दिया गया'
        );


      case 'out_for_delivery':

        return this.t(
          'Out for Delivery',
          'டெலிவரிக்காக வெளியேறியது',
          'डिलीवरी के लिए निकला'
        );


      case 'delivered':

        return this.t(
          'Delivered',
          'டெலிவரி செய்யப்பட்டது',
          'डिलीवर किया गया'
        );


      case 'cancelled':

        return this.t(
          'Cancelled',
          'ரத்து செய்யப்பட்டது',
          'रद्द किया गया'
        );


      default:

        return status;

    }

  }


  /* =====================================================
     COMMON TRANSLATION
  ===================================================== */

  t(
    english: string,
    tamil: string,
    hindi: string
  ): string {

    if (
      this.language === 'ta'
    ) {

      return tamil;

    }


    if (
      this.language === 'hi'
    ) {

      return hindi;

    }


    return english;

  }

}