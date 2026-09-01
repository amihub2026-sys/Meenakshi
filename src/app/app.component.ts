import {
  Component,
  inject
} from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { CartService } from './services/cart';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

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
    RouterLinkActive,
  AsyncPipe

  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  

  menuOpen = false;

  language: Language = 'ta';
  private readonly cartService =
  inject(CartService);

readonly cartCount$ =
  this.cartService.cartCount$;

  constructor(
    private languageService: LanguageService
  ) {

    this.languageService.language$.subscribe(
      (lang: Language) => {
        this.language = lang;
      }
    );

  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  changeLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
  }

}