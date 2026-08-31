import { Component } from '@angular/core';

import {
  Language,
  LanguageService
} from '../../services/language.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html'
})
export class ContactComponent {

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

  translations = {

    en: {
      heroKicker: 'CONTACT US',
      heroTitle1: 'Visit us in the heart of',
      heroTitle2: 'Madurai.',
      heroDesc:
        'Tradition, devotion and authentic pooja essentials waiting to welcome you.',

      visitLabel: 'COME VISIT US',
      visitTitle1: 'Bring home the fragrance of',
      visitTitle2: 'tradition.',
      intro:
        'For product availability, pooja combo orders, temple requirements and bulk orders, connect with Madurai Meenakshi Santhana Kadai.',

      store: 'STORE',
      storeName: 'Madurai Meenakshi Santhana Kadai',

      location: 'LOCATION',
      locationText: 'Madurai, Tamil Nadu',

      timings: 'TIMINGS',
      timingsText: 'Daily • Morning to Evening',

      enquiries: 'ENQUIRIES',
      enquiriesText: 'Santhanam • Pooja • Bulk Orders',

      callNow: 'Call Now',
      whatsapp: 'WhatsApp',

      mapCity: 'MADURAI',
      mapLocation: 'Near Meenakshi Amman Temple',
      openMaps: 'Open in Google Maps'
    },

    ta: {
      heroKicker: 'தொடர்பு கொள்ளுங்கள்',
      heroTitle1: 'மதுரையின் இதயத்தில்',
      heroTitle2: 'எங்களை சந்திக்க வாருங்கள்.',
      heroDesc:
        'பாரம்பரியம், பக்தி மற்றும் உண்மையான பூஜைப் பொருட்களுடன் உங்களை அன்புடன் வரவேற்க காத்திருக்கிறோம்.',

      visitLabel: 'எங்களை சந்திக்க வாருங்கள்',
      visitTitle1: 'பாரம்பரியத்தின் மணத்தை',
      visitTitle2: 'உங்கள் இல்லத்திற்கு கொண்டு செல்லுங்கள்.',
      intro:
        'பொருட்களின் இருப்பு, பூஜை காம்போ ஆர்டர்கள், கோவில் தேவைகள் மற்றும் மொத்த ஆர்டர்களுக்கு மதுரை மீனாட்சி சந்தனக் கடையை தொடர்பு கொள்ளுங்கள்.',

      store: 'கடை',
      storeName: 'மதுரை மீனாட்சி சந்தனக் கடை',

      location: 'இடம்',
      locationText: 'மதுரை, தமிழ்நாடு',

      timings: 'நேரம்',
      timingsText: 'தினமும் • காலை முதல் மாலை வரை',

      enquiries: 'விசாரணைகள்',
      enquiriesText: 'சந்தனம் • பூஜை • மொத்த ஆர்டர்கள்',

      callNow: 'இப்போது அழைக்கவும்',
      whatsapp: 'WhatsApp',

      mapCity: 'மதுரை',
      mapLocation: 'மீனாட்சி அம்மன் கோவில் அருகில்',
      openMaps: 'Google Maps-ல் திறக்க'
    },

    hi: {
      heroKicker: 'संपर्क करें',
      heroTitle1: 'मदुरै के हृदय में',
      heroTitle2: 'हमसे मिलने आएँ।',
      heroDesc:
        'परंपरा, भक्ति और प्रामाणिक पूजा सामग्री के साथ आपका स्वागत करने के लिए हम तैयार हैं।',

      visitLabel: 'हमसे मिलने आएँ',
      visitTitle1: 'परंपरा की सुगंध',
      visitTitle2: 'अपने घर ले जाएँ।',
      intro:
        'उत्पाद उपलब्धता, पूजा कॉम्बो ऑर्डर, मंदिर आवश्यकताओं और थोक ऑर्डर के लिए मदुरै मीनाक्षी चंदन दुकान से संपर्क करें।',

      store: 'दुकान',
      storeName: 'मदुरै मीनाक्षी चंदन दुकान',

      location: 'स्थान',
      locationText: 'मदुरै, तमिलनाडु',

      timings: 'समय',
      timingsText: 'प्रतिदिन • सुबह से शाम तक',

      enquiries: 'पूछताछ',
      enquiriesText: 'चंदन • पूजा • थोक ऑर्डर',

      callNow: 'अभी कॉल करें',
      whatsapp: 'WhatsApp',

      mapCity: 'मदुरै',
      mapLocation: 'मीनाक्षी अम्मन मंदिर के पास',
      openMaps: 'Google Maps में खोलें'
    }

  };

  get text() {
    return this.translations[this.language];
  }

}