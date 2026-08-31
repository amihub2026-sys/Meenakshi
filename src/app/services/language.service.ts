import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export type Language = 'en' | 'ta' | 'hi';


@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private languageSubject =
    new BehaviorSubject<Language>(
      this.getSavedLanguage()
    );


  language$ =
    this.languageSubject.asObservable();


  get currentLanguage(): Language {
    return this.languageSubject.value;
  }


  setLanguage(language: Language): void {

    this.languageSubject.next(language);

    localStorage.setItem(
      'site-language',
      language
    );

  }


  private getSavedLanguage(): Language {

    const savedLanguage =
      localStorage.getItem('site-language');


    if (
      savedLanguage === 'en' ||
      savedLanguage === 'ta' ||
      savedLanguage === 'hi'
    ) {
      return savedLanguage;
    }


    // DEFAULT LANGUAGE
    return 'ta';
  }

}