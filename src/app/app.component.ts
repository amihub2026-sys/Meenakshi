import { Component } from '@angular/core';
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
    RouterLinkActive
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {

  menuOpen = false;

  language: Language = 'ta';

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