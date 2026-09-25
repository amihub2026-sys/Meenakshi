import {
  Component,
  inject,
    HostListener
} from '@angular/core';

import { AsyncPipe } from '@angular/common';
import {
  environment
} from '../environments/environment';
import {
  Router,
  RouterLink,
  
  RouterLinkActive,
  RouterOutlet,
  NavigationEnd
} from '@angular/router';
import { UserAuthService } from './services/user-auth.service';
import { filter } from 'rxjs/operators';

import { CartService } from './services/cart';
import { CommonModule } from '@angular/common';

import {
  LanguageService,
  Language
} from './services/language.service';

@Component({
  selector: 'app-root',

  standalone: true,

  imports: [
    RouterOutlet,
    RouterLink,
      CommonModule,
    RouterLinkActive,
    AsyncPipe
  ],

  templateUrl: './app.component.html'
})
export class AppComponent {
  languageMenuOpen = false;
  menuOpen = false;
private readonly userAuthService = inject(UserAuthService);
showLoginModal = false;
loginError = '';
currentUser: {
  id: string;
  name: string;
  email: string;
  picture: string;
} | null = null;

accountMenuOpen = false;
  language: Language = 'ta';

  private readonly cartService = inject(CartService);
private renderGoogleLoginButton(): void {

  const google =
    (window as any).google;

  if (!google?.accounts?.id) {

    console.error(
      'Google Identity Services not loaded'
    );

    return;
  }


  const buttonContainer =
    document.getElementById(
      'navbar-google-signin-button'
    );


  if (!buttonContainer) {
    return;
  }


  buttonContainer.innerHTML = '';


  google.accounts.id.initialize({

    client_id:
      environment.googleClientId,


    callback: (response: any) => {

      const credential =
        response?.credential;


      if (!credential) {

        this.loginError =
          'Google login failed. Please try again.';

        return;
      }


      this.userAuthService
        .googleLogin(credential)
        .subscribe({

          next: result => {

            this.currentUser =
              result.user;


            window.localStorage.setItem(

              'user',

              JSON.stringify(
                result.user
              )

            );


            this.showLoginModal = false;


            /* =====================
               CART LOGIN FLOW
            ===================== */

            const localItems =
              this.cartService
                .getCartItems();


            if (
              localItems.length > 0
            ) {

              this.cartService
                .mergeGuestCart();

            } else {

              this.cartService
                .loadUserCart();

            }


            window.dispatchEvent(

              new CustomEvent(
                'user-login-success'
              )

            );

          },


          error: error => {

            console.error(
              'Google login failed:',
              error
            );

            this.loginError =
              'Unable to login with Google.';

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
  readonly cartCount$ = this.cartService.cartCount$;

  constructor(
  private languageService: LanguageService,
  private router: Router
) {
  this.languageService.language$.subscribe(
    (lang: Language) => {
      this.language = lang;
    }
  );

  this.loadCurrentUser();

  this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    });


    // Move every newly opened page to the top
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      });
  }
 openLoginModal(): void {

  this.showLoginModal = true;
  this.loginError = '';

  setTimeout(() => {
    this.renderGoogleLoginButton();
  });
}
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
   toggleLanguageMenu(): void {
  this.languageMenuOpen = !this.languageMenuOpen;
}
changeLanguage(lang: Language): void {
  this.languageService.setLanguage(lang);

  this.languageMenuOpen = false;
}
loadCurrentUser(): void {
  this.userAuthService
    .getCurrentUser()
    .subscribe({
      next: response => {
        this.currentUser = response.user;
      },

      error: () => {
        this.currentUser = null;
      }
    });
}

toggleAccountMenu(): void {
  this.accountMenuOpen =
    !this.accountMenuOpen;
}

closeAccountMenu(): void {
  this.accountMenuOpen = false;
}
@HostListener(
  'window:user-login-success'
)
onUserLoginSuccess(): void {

  this.loadCurrentUser();


  const localItems =
    this.cartService
      .getCartItems();


  /* =========================
     Guest already has products
     → merge with MongoDB cart
  ========================= */

  if (
    localItems.length > 0
  ) {

    this.cartService
      .mergeGuestCart();

    return;
  }


  /* =========================
     Guest cart empty
     → restore MongoDB cart
  ========================= */

  this.cartService
    .loadUserCart();

}
 @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {

  const target = event.target as HTMLElement;

  const clickedHamburger = target.closest('.nav-hamburger');
  const clickedMenu = target.closest('.main-nav');

  const clickedLanguageButton = target.closest('.mobile-language-btn');
  const clickedLanguageDropdown = target.closest('.mobile-language-dropdown');


  // CLOSE MOBILE NAV
  if (
    this.menuOpen &&
    !clickedHamburger &&
    !clickedMenu
  ) {
    this.menuOpen = false;
  }


  // CLOSE LANGUAGE DROPDOWN
  if (
    this.languageMenuOpen &&
    !clickedLanguageButton &&
    !clickedLanguageDropdown
  ) {
    this.languageMenuOpen = false;
  }

}
closeLoginModal(): void {
  this.showLoginModal = false;
}
logout(): void {

  this.userAuthService
    .logout()
    .subscribe({

      next: () => {

        this.currentUser = null;

        this.accountMenuOpen = false;


        /* =========================
           CLEAR ONLY BROWSER CART
           MongoDB cart stays saved
        ========================= */

        this.cartService
          .clearLocalCart();


        /* =========================
           CLEAR LOCAL USER CACHE
        ========================= */

        window.localStorage.removeItem(
          'user'
        );


        /* =========================
           NOTIFY UI
        ========================= */

        window.dispatchEvent(
          new CustomEvent(
            'user-logout-success'
          )
        );


        /* =========================
           GO HOME
        ========================= */

        this.router.navigate(['/']);

      },


      error: error => {

        console.error(
          'Logout failed:',
          error
        );

      }

    });

}
}