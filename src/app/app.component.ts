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
}