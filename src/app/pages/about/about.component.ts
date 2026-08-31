import {
  AfterViewInit,
  Component
} from '@angular/core';

import {
  Language,
  LanguageService
} from '../../services/language.service';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html'
})
export class AboutComponent implements AfterViewInit {

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
      heroKicker: 'OUR STORY',
      heroTitle1: 'Rooted in Madurai,',
      heroTitle2: 'Carried by Tradition',
      heroDesc:
        'A journey inspired by devotion, purity and the timeless spiritual traditions of Madurai.',
      heritage: 'HERITAGE',
      maduraiTradition: 'Madurai Tradition',
      promise: 'PROMISE',
      pureAuthentic: 'Pure & Authentic',
      discover: 'DISCOVER',

      storyLabel: 'OUR STORY',
      storyTitle1:
        'May life be filled with peace like the fragrance of sandalwood,',
      storyTitle2:
        'and may every home be blessed with prosperity.',
      storyLead:
        'Madurai Meenakshi Santhana Kadai carries forward the familiar warmth of Madurai’s pooja traditions with carefully selected santhanam and devotional essentials.',
      storyDesc:
        'From everyday worship to temple visits and family occasions, we bring together trusted products with the comforting feeling of a traditional neighbourhood shop.',

      traditional: 'Traditional',
      maduraiHeritage: 'Madurai Heritage',
      pure: 'Pure',
      selectedEssentials: 'Selected Essentials',
      trusted: 'Trusted',
      homelyService: 'Homely Service',
      discoverCollection: 'Discover Our Collection',

      imageSmall: 'FROM THE HEART OF MADURAI',
      imageTitle: 'Tradition you can feel.',
      goldText: 'Pure tradition, carefully preserved.',

      journeyKicker: 'A SACRED JOURNEY',
      journeyTitle1: 'From Madurai Tradition',
      journeyTitle2: 'To Your Daily Prayer',
      journeyDesc:
        'Every pooja begins with purity, fragrance and devotion. Our collection brings the traditional essence of Madurai into every sacred moment.',

      step1Small: 'BEGIN WITH PURITY',
      step1Title: 'Pure Santhanam',
      step1Desc:
        'Authentic sandalwood selected for pooja, abhishekam and traditional worship.',

      step2Small: 'CREATE THE DIVINE SPACE',
      step2Title: 'Sacred Fragrance',
      step2Desc:
        'Traditional incense and sambrani that fill your prayer space with a peaceful temple aroma.',

      step3Small: 'COMPLETE THE PRAYER',
      step3Title: 'Pooja Essentials',
      step3Desc:
        'Carefully selected traditional essentials for every festival, prayer and auspicious occasion.',

      journeyBottom: 'Madurai Tradition',
      exploreCollection: 'Explore Collection'
    },

    ta: {
      heroKicker: 'எங்கள் கதை',
      heroTitle1: 'மதுரையில் வேரூன்றி,',
      heroTitle2: 'பாரம்பரியத்தை தாங்கி',
      heroDesc:
        'பக்தி, தூய்மை மற்றும் மதுரையின் காலத்தால் அழியாத ஆன்மிக மரபுகளால் ஈர்க்கப்பட்ட ஒரு பயணம்.',
      heritage: 'பாரம்பரியம்',
      maduraiTradition: 'மதுரை மரபு',
      promise: 'எங்கள் வாக்குறுதி',
      pureAuthentic: 'தூய்மை & நம்பிக்கை',
      discover: 'மேலும் அறிக',

      storyLabel: 'எங்கள் கதை',
      storyTitle1:
        'சந்தன மணம் போல வாழ்வில் அமைதியும்,',
      storyTitle2:
        'அம்மன் அருளால் இல்லத்தில் வளமும் நிறையட்டும்.',
      storyLead:
        'மதுரை மீனாட்சி சந்தனக் கடை, கவனமாகத் தேர்ந்தெடுக்கப்பட்ட சந்தனம் மற்றும் பக்திப் பொருட்களுடன் மதுரையின் பூஜை மரபுகளின் நெருக்கத்தையும் வெப்பத்தையும் தொடர்ந்து கொண்டு செல்கிறது.',
      storyDesc:
        'தினசரி வழிபாடு முதல் கோவில் தரிசனம் மற்றும் குடும்ப நிகழ்வுகள் வரை, நம்பிக்கையான பொருட்களை பாரம்பரிய அக்கம்பக்கக் கடையின் அன்பான உணர்வுடன் வழங்குகிறோம்.',

      traditional: 'பாரம்பரியம்',
      maduraiHeritage: 'மதுரை மரபு',
      pure: 'தூய்மை',
      selectedEssentials: 'தேர்ந்தெடுக்கப்பட்ட பொருட்கள்',
      trusted: 'நம்பிக்கை',
      homelyService: 'அன்பான சேவை',
      discoverCollection: 'எங்கள் பொருட்களை காண்க',

      imageSmall: 'மதுரையின் இதயத்திலிருந்து',
      imageTitle: 'உணரக்கூடிய பாரம்பரியம்.',
      goldText: 'தூய பாரம்பரியம், அக்கறையுடன் பாதுகாக்கப்படுகிறது.',

      journeyKicker: 'ஒரு புனிதப் பயணம்',
      journeyTitle1: 'மதுரை பாரம்பரியத்திலிருந்து',
      journeyTitle2: 'உங்கள் தினசரி பூஜைக்கு',
      journeyDesc:
        'ஒவ்வொரு பூஜையும் தூய்மை, மணம் மற்றும் பக்தியுடன் தொடங்குகிறது. எங்கள் தொகுப்பு மதுரையின் பாரம்பரிய ஆன்மிக உணர்வை ஒவ்வொரு புனித தருணத்துக்கும் கொண்டு வருகிறது.',

      step1Small: 'தூய்மையுடன் தொடங்குங்கள்',
      step1Title: 'தூய சந்தனம்',
      step1Desc:
        'பூஜை, அபிஷேகம் மற்றும் பாரம்பரிய வழிபாட்டிற்காக தேர்ந்தெடுக்கப்பட்ட இயற்கை சந்தனம்.',

      step2Small: 'தெய்வீக சூழலை உருவாக்குங்கள்',
      step2Title: 'புனித மணம்',
      step2Desc:
        'உங்கள் பூஜை இடத்தை கோவில் மணமும் அமைதியும் நிறைந்ததாக மாற்றும் பாரம்பரிய தூபம் மற்றும் சாம்பிராணி.',

      step3Small: 'பூஜையை நிறைவு செய்யுங்கள்',
      step3Title: 'பூஜை பொருட்கள்',
      step3Desc:
        'ஒவ்வொரு திருவிழா, பூஜை மற்றும் சுபநிகழ்ச்சிக்கும் கவனமாக தேர்ந்தெடுக்கப்பட்ட பாரம்பரிய பொருட்கள்.',

      journeyBottom: 'மதுரை மரபு',
      exploreCollection: 'பொருட்களை காண்க'
    },

    hi: {
      heroKicker: 'हमारी कहानी',
      heroTitle1: 'मदुरै में जड़ें,',
      heroTitle2: 'परंपरा के साथ',
      heroDesc:
        'भक्ति, शुद्धता और मदुरै की कालातीत आध्यात्मिक परंपराओं से प्रेरित एक यात्रा।',
      heritage: 'विरासत',
      maduraiTradition: 'मदुरै परंपरा',
      promise: 'हमारा वादा',
      pureAuthentic: 'शुद्ध एवं प्रामाणिक',
      discover: 'और जानें',

      storyLabel: 'हमारी कहानी',
      storyTitle1:
        'चंदन की सुगंध जैसी शांति जीवन में बनी रहे,',
      storyTitle2:
        'और देवी की कृपा से हर घर में समृद्धि आए।',
      storyLead:
        'मदुरै मीनाक्षी चंदन दुकान सावधानी से चुने गए चंदन और पूजा सामग्री के साथ मदुरै की पूजा परंपराओं की आत्मीयता को आगे बढ़ाती है.',
      storyDesc:
        'दैनिक पूजा से लेकर मंदिर दर्शन और पारिवारिक अवसरों तक, हम विश्वसनीय वस्तुओं को पारंपरिक पड़ोस की दुकान जैसी आत्मीय सेवा के साथ प्रदान करते हैं.',

      traditional: 'पारंपरिक',
      maduraiHeritage: 'मदुरै विरासत',
      pure: 'शुद्ध',
      selectedEssentials: 'चुनी गई सामग्री',
      trusted: 'विश्वसनीय',
      homelyService: 'आत्मीय सेवा',
      discoverCollection: 'हमारा संग्रह देखें',

      imageSmall: 'मदुरै के हृदय से',
      imageTitle: 'परंपरा जिसे महसूस किया जा सके।',
      goldText: 'शुद्ध परंपरा, सावधानी से संरक्षित।',

      journeyKicker: 'एक पवित्र यात्रा',
      journeyTitle1: 'मदुरै की परंपरा से',
      journeyTitle2: 'आपकी दैनिक पूजा तक',
      journeyDesc:
        'हर पूजा शुद्धता, सुगंध और भक्ति से शुरू होती है। हमारा संग्रह मदुरै की पारंपरिक आध्यात्मिक भावना को हर पवित्र क्षण तक लाता है.',

      step1Small: 'शुद्धता से शुरुआत',
      step1Title: 'शुद्ध चंदन',
      step1Desc:
        'पूजा, अभिषेक और पारंपरिक उपासना के लिए चुना गया प्रामाणिक चंदन.',

      step2Small: 'पवित्र वातावरण बनाएँ',
      step2Title: 'पवित्र सुगंध',
      step2Desc:
        'पारंपरिक अगरबत्ती और साम्ब्राणी जो आपके पूजा स्थान में मंदिर जैसी शांत सुगंध भरते हैं.',

      step3Small: 'पूजा पूर्ण करें',
      step3Title: 'पूजा सामग्री',
      step3Desc:
        'हर त्योहार, पूजा और शुभ अवसर के लिए सावधानी से चुनी गई पारंपरिक सामग्री.',

      journeyBottom: 'मदुरै परंपरा',
      exploreCollection: 'संग्रह देखें'
    }

  };


  get text() {
    return this.translations[this.language];
  }


  ngAfterViewInit(): void {

    setTimeout(() => {

      document
        .querySelectorAll(
          '.reveal-left, .reveal-right'
        )
        .forEach(
          el =>
            el.classList.add('active')
        );

    });

  }

}