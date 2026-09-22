import {
  Component,
  inject,
    HostListener
} from '@angular/core';

import { AsyncPipe } from '@angular/common';

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

currentUser: {
  id: string;
  name: string;
  email: string;
  picture: string;
} | null = null;

accountMenuOpen = false;
  language: Language = 'ta';

  private readonly cartService = inject(CartService);

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
@HostListener('window:user-login-success')
onUserLoginSuccess(): void {
  this.loadCurrentUser();
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
logout(): void {
  this.userAuthService
    .logout()
    .subscribe({
      next: () => {
        this.currentUser = null;
        this.accountMenuOpen = false;

        window.localStorage.removeItem('user');

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