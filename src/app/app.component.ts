import {
  Component,
  inject
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

  changeLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
  }
}