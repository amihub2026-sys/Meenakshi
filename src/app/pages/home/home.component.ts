import {
  AfterViewInit,
  Component,
  OnDestroy
} from '@angular/core';

import {
  LanguageService,
  Language
} from '../../services/language.service';


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  private timer?: number;
    private typingTimer: any;
private typingIndex = 0;
  private current = 0;

  private whyObserver?: IntersectionObserver;

  private centerObserver?: IntersectionObserver;


  /* ==========================================
     CURRENT LANGUAGE
  ========================================== */

  language: Language = 'ta';


  constructor(
    private languageService: LanguageService
  ) {

    this.languageService.language$.subscribe(
  (lang: Language) => {

    this.language = lang;

    setTimeout(() => {
      this.startHeroTyping();
    }, 100);

  }
);

  }


  /* ==========================================
     HOME TRANSLATIONS
  ========================================== */

  translations = {

    /* ================= ENGLISH ================= */

    en: {

      heroKicker:
        'THE TRADITION OF MADURAI',

      heroTitle:
        'May every home be filled with peace, prosperity and divine blessings.',

      heroDescription:
        'Authentic Santhanam & traditional pooja essentials, carefully selected to bring the sacred essence of Madurai into every prayer.',

      exploreCollection:
        'Explore Our Collection',

      visitStore:
        'Visit Our Store',

      ourPromise:
        'OUR PROMISE',

      pureAuthentic:
        'Pure & Authentic',

      ourRoots:
        'OUR ROOTS',

      maduraiTradition:
        'Madurai Tradition',

      speciality:
        'OUR SPECIALITY',

      santhanamPooja:
        'Santhanam & Pooja',

      scroll:
        'SCROLL',


      whyLabel:
        'WHY CHOOSE US',

      whyTitle1:
        'More than pooja essentials.',

      whyTitle2:
        'A feeling of home & devotion.',

      whyDescription:
        'From the fragrance of fresh santhanam to the warmth of a glowing deepam, every product is chosen to bring the familiar feeling of tradition into your prayer.',


      pureTraditional:
        'Pure & Traditional',

      pureTraditionalDesc:
        'Carefully selected pooja essentials rooted in the traditions followed by generations.',


      homelyTrust:
        'Homely Trust',

      homelyTrustDesc:
        'The warmth and personal care of a familiar neighbourhood pooja shop.',


      fromMadurai:
        'From Madurai',

      fromMaduraiDesc:
        'Inspired by the sacred temple streets and devotional heritage of Madurai.',


      everyPrayer:
        'For Every Prayer',

      everyPrayerDesc:
        'Daily worship, temple visits, festivals, family functions and special occasions.',


      centerSmall:
        'Madurai Tradition',

      centerTitle:
        'With devotion',

      centerTitle2:
        'for every prayer',

      centerText:
        'May your heart be filled with peace like the fragrance of sandalwood.',


      whyBottom:
        'Sandalwood • Devotion • Tradition • Trust',


      faqKicker:
        'QUESTIONS & ANSWERS',

      faqTitle1:
        'Everything you may',

      faqTitle2:
        'want to know.',

      faqDescription:
        'Simple answers about our Santhanam, pooja products, bulk orders and store services.',


      q1:
        'Do you provide pure Santhanam?',

      a1:
        'Yes. We provide traditionally selected Santhanam suitable for pooja, worship, abhishekam and sacred occasions.',


      q2:
        'What pooja products are available?',

      a2:
        'Our collection includes Santhanam, Kumkum, turmeric, Sambrani, Pathi, Vilakku, Ghee, Honey and other traditional pooja essentials.',


      q3:
        'Do you accept bulk pooja orders?',

      a3:
        'Yes. Bulk orders can be arranged for temples, family functions, weddings, festivals, devotional events and special occasions.',


      q4:
        'Can I enquire about product availability?',

      a4:
        'Yes. You can contact us by phone or WhatsApp to check availability before visiting the store.',


      q5:
        'Where is the store located?',

      a5:
        'Madurai Meenakshi Santhana Kadai is located in Madurai, Tamil Nadu. Please visit our Contact page for directions and store information.',


      marquee:
        'Santhanam • Pooja Essentials • Temple Fragrance • Traditional Trust • Santhanam • Pooja Essentials • Temple Fragrance • Traditional Trust',


      glanceKicker:
        'ABOUT AT A GLANCE',

      glanceTitle1:
        'A tradition',

      glanceTitle2:
        'carried with care.',

      glanceLead:
        'Madurai Meenakshi Santhana Kadai brings together purity, devotion and the familiar warmth of traditional pooja culture.',


      rooted:
        'Rooted in Madurai',

      rootedDesc:
        'Inspired by the sacred streets, temple traditions and devotional heritage of Madurai.',


      pureChoice:
        'Pure by Choice',

      pureChoiceDesc:
        'Every product is selected with attention to authenticity, quality and traditional use.',


      trusted:
        'Trusted for Every Prayer',

      trustedDesc:
        'From daily worship to festivals and family occasions, tradition remains at the heart.',


      tradition:
        'TRADITION'

    },


    /* ================= TAMIL ================= */

    ta: {

      heroKicker:
        'மதுரையின் பாரம்பரியம்',

      heroTitle:
        'அங்கயற்கண்ணி அருளால் அனைவரின் இல்லங்களிலும் மங்களம் பெருகட்டும்.',

      heroDescription:
        'தூய சந்தனம் மற்றும் பாரம்பரிய பூஜைப் பொருட்கள், மதுரையின் தெய்வீக மணத்தையும் மரபையும் உங்கள் ஒவ்வொரு பூஜைக்கும் கொண்டு வர கவனமாக தேர்ந்தெடுக்கப்படுகின்றன.',

      exploreCollection:
        'எங்கள் பொருட்களை காண்க',

      visitStore:
        'எங்கள் கடைக்கு வாருங்கள்',

      ourPromise:
        'எங்கள் வாக்குறுதி',

      pureAuthentic:
        'தூய்மை & நம்பிக்கை',

      ourRoots:
        'எங்கள் வேர்',

      maduraiTradition:
        'மதுரை பாரம்பரியம்',

      speciality:
        'எங்கள் சிறப்பு',

      santhanamPooja:
        'சந்தனம் & பூஜை',

      scroll:
        'கீழே பார்க்க',


      whyLabel:
        'ஏன் எங்களை தேர்வு செய்ய வேண்டும்',

      whyTitle1:
        'பூஜைப் பொருட்களைத் தாண்டி.',

      whyTitle2:
        'வீட்டின் அன்பும் பக்தியின் உணர்வும்.',

      whyDescription:
        'புதிய சந்தனத்தின் மணம் முதல் விளக்கின் புனித ஒளி வரை, ஒவ்வொரு பொருளும் உங்கள் பூஜையில் பாரம்பரியத்தின் நெருக்கத்தை உணரச் செய்ய தேர்ந்தெடுக்கப்படுகிறது.',


      pureTraditional:
        'தூய்மை & பாரம்பரியம்',

      pureTraditionalDesc:
        'தலைமுறைகளாக பின்பற்றப்படும் மரபுகளின் அடிப்படையில் கவனமாக தேர்ந்தெடுக்கப்பட்ட பூஜைப் பொருட்கள்.',


      homelyTrust:
        'குடும்ப நம்பிக்கை',

      homelyTrustDesc:
        'நம் அருகிலுள்ள பாரம்பரிய பூஜைக் கடையின் அன்பும் தனிப்பட்ட கவனமும்.',


      fromMadurai:
        'மதுரையிலிருந்து',

      fromMaduraiDesc:
        'மதுரையின் புனித கோவில் வீதிகளும் பக்தி பாரம்பரியமும் எங்களுக்கு ஊக்கமாக உள்ளன.',


      everyPrayer:
        'ஒவ்வொரு பூஜைக்கும்',

      everyPrayerDesc:
        'தினசரி பூஜை, கோவில் தரிசனம், திருவிழா, குடும்ப விழா மற்றும் சிறப்பு நிகழ்வுகளுக்கு.',


      centerSmall:
        'மதுரை மரபு',

      centerTitle:
        'நம்பிக்கையுடன்',

      centerTitle2:
        'ஒவ்வொரு பூஜைக்கும்',

      centerText:
        'சந்தன மணம் போல மனதில் அமைதி நிறையட்டும்',


      whyBottom:
        'சந்தனம் • பக்தி • பாரம்பரியம் • நம்பிக்கை',


      faqKicker:
        'கேள்விகள் & பதில்கள்',

      faqTitle1:
        'நீங்கள் அறிய விரும்பும்',

      faqTitle2:
        'அனைத்திற்கும் பதில்கள்.',

      faqDescription:
        'எங்கள் சந்தனம், பூஜைப் பொருட்கள், மொத்த ஆர்டர்கள் மற்றும் கடை சேவைகள் பற்றிய எளிய பதில்கள்.',


      q1:
        'தூய சந்தனம் கிடைக்குமா?',

      a1:
        'ஆம். பூஜை, வழிபாடு, அபிஷேகம் மற்றும் சுப நிகழ்வுகளுக்கு ஏற்ற பாரம்பரியமாக தேர்ந்தெடுக்கப்பட்ட தூய சந்தனம் கிடைக்கிறது.',


      q2:
        'என்னென்ன பூஜைப் பொருட்கள் கிடைக்கும்?',

      a2:
        'சந்தனம், குங்குமம், மஞ்சள், சாம்பிராணி, பத்தி, விளக்கு, நெய், தேன் மற்றும் பல பாரம்பரிய பூஜைப் பொருட்கள் கிடைக்கின்றன.',


      q3:
        'மொத்தமாக பூஜைப் பொருட்கள் ஆர்டர் செய்யலாமா?',

      a3:
        'ஆம். கோவில்கள், குடும்ப நிகழ்ச்சிகள், திருமணங்கள், திருவிழாக்கள் மற்றும் பக்தி நிகழ்ச்சிகளுக்கான மொத்த ஆர்டர்கள் ஏற்றுக்கொள்ளப்படும்.',


      q4:
        'பொருட்களின் இருப்பை முன்கூட்டியே தெரிந்து கொள்ள முடியுமா?',

      a4:
        'ஆம். கடைக்கு வருவதற்கு முன் தொலைபேசி அல்லது WhatsApp மூலம் பொருள் இருப்பை கேட்டறியலாம்.',


      q5:
        'கடை எங்கு உள்ளது?',

      a5:
        'மதுரை மீனாட்சி சந்தனக் கடை, மதுரை, தமிழ்நாட்டில் அமைந்துள்ளது. வழிகாட்டுதல் மற்றும் கடை விவரங்களுக்கு தொடர்பு பக்கத்தை பாருங்கள்.',


      marquee:
        'சந்தனம் • பூஜை பொருட்கள் • கோவில் வாசனை • பாரம்பரிய நம்பிக்கை • சந்தனம் • பூஜை பொருட்கள் • கோவில் வாசனை • பாரம்பரிய நம்பிக்கை',


      glanceKicker:
        'எங்களைப் பற்றி ஒரு பார்வை',

      glanceTitle1:
        'அக்கறையுடன்',

      glanceTitle2:
        'தொடரும் பாரம்பரியம்.',

      glanceLead:
        'மதுரை மீனாட்சி சந்தனக் கடை தூய்மை, பக்தி மற்றும் பாரம்பரிய பூஜை கலாச்சாரத்தின் நெருக்கத்தை ஒன்றாக கொண்டு வருகிறது.',


      rooted:
        'மதுரையில் வேரூன்றியது',

      rootedDesc:
        'மதுரையின் புனித வீதிகள், கோவில் மரபுகள் மற்றும் பக்திப் பாரம்பரியத்தால் ஈர்க்கப்பட்டது.',


      pureChoice:
        'தூய்மையே எங்கள் தேர்வு',

      pureChoiceDesc:
        'ஒவ்வொரு பொருளும் அதன் உண்மைத்தன்மை, தரம் மற்றும் பாரம்பரிய பயன்பாட்டை கருத்தில் கொண்டு தேர்ந்தெடுக்கப்படுகிறது.',


      trusted:
        'ஒவ்வொரு பூஜைக்கும் நம்பிக்கை',

      trustedDesc:
        'தினசரி வழிபாடு முதல் திருவிழாக்கள் மற்றும் குடும்ப நிகழ்ச்சிகள் வரை பாரம்பரியம் எப்போதும் மையமாக உள்ளது.',


      tradition:
        'பாரம்பரியம்'

    },


    /* ================= HINDI ================= */

    hi: {

      heroKicker:
        'मदुरै की परंपरा',

      heroTitle:
        'मीनाक्षी अम्मन की कृपा से हर घर में शांति, समृद्धि और मंगल बना रहे।',

      heroDescription:
        'शुद्ध चंदन और पारंपरिक पूजा सामग्री, मदुरै की पवित्र परंपरा और सुगंध को आपकी हर पूजा तक पहुँचाने के लिए सावधानी से चुनी जाती है।',

      exploreCollection:
        'हमारा संग्रह देखें',

      visitStore:
        'हमारी दुकान आएँ',

      ourPromise:
        'हमारा वादा',

      pureAuthentic:
        'शुद्ध एवं प्रामाणिक',

      ourRoots:
        'हमारी जड़ें',

      maduraiTradition:
        'मदुरै परंपरा',

      speciality:
        'हमारी विशेषता',

      santhanamPooja:
        'चंदन एवं पूजा',

      scroll:
        'नीचे देखें',


      whyLabel:
        'हमें क्यों चुनें',

      whyTitle1:
        'सिर्फ पूजा सामग्री नहीं।',

      whyTitle2:
        'घर और भक्ति का एहसास।',

      whyDescription:
        'ताज़े चंदन की सुगंध से लेकर दीपक की पवित्र रोशनी तक, हर वस्तु आपकी पूजा में परंपरा का परिचित अनुभव लाने के लिए चुनी जाती है।',


      pureTraditional:
        'शुद्ध एवं पारंपरिक',

      pureTraditionalDesc:
        'पीढ़ियों से चली आ रही परंपराओं के अनुसार सावधानी से चुनी गई पूजा सामग्री।',


      homelyTrust:
        'अपनापन और विश्वास',

      homelyTrustDesc:
        'एक परिचित पारंपरिक पूजा दुकान जैसी आत्मीयता और व्यक्तिगत देखभाल।',


      fromMadurai:
        'मदुरै से',

      fromMaduraiDesc:
        'मदुरै की पवित्र मंदिर गलियों और धार्मिक विरासत से प्रेरित।',


      everyPrayer:
        'हर पूजा के लिए',

      everyPrayerDesc:
        'दैनिक पूजा, मंदिर दर्शन, त्योहार, पारिवारिक समारोह और विशेष अवसरों के लिए।',


      centerSmall:
        'मदुरै परंपरा',

      centerTitle:
        'विश्वास के साथ',

      centerTitle2:
        'हर पूजा के लिए',

      centerText:
        'चंदन की सुगंध की तरह मन में शांति बनी रहे।',


      whyBottom:
        'चंदन • भक्ति • परंपरा • विश्वास',


      faqKicker:
        'प्रश्न और उत्तर',

      faqTitle1:
        'आप जो जानना',

      faqTitle2:
        'चाहते हैं।',

      faqDescription:
        'हमारे चंदन, पूजा सामग्री, थोक ऑर्डर और दुकान सेवाओं के बारे में सरल उत्तर।',


      q1:
        'क्या आपके पास शुद्ध चंदन उपलब्ध है?',

      a1:
        'हाँ। पूजा, अभिषेक और शुभ अवसरों के लिए पारंपरिक रूप से चुना गया शुद्ध चंदन उपलब्ध है।',


      q2:
        'कौन-कौन सी पूजा सामग्री उपलब्ध है?',

      a2:
        'हमारे संग्रह में चंदन, कुमकुम, हल्दी, साम्ब्राणी, पथी, दीपक, घी, शहद और अन्य पारंपरिक पूजा सामग्री शामिल हैं।',


      q3:
        'क्या आप थोक पूजा ऑर्डर स्वीकार करते हैं?',

      a3:
        'हाँ। मंदिर, विवाह, पारिवारिक कार्यक्रम, त्योहार और धार्मिक आयोजनों के लिए थोक ऑर्डर किए जा सकते हैं।',


      q4:
        'क्या उत्पाद उपलब्धता के बारे में पहले पूछ सकते हैं?',

      a4:
        'हाँ। दुकान आने से पहले फोन या WhatsApp के माध्यम से उपलब्धता की जानकारी प्राप्त कर सकते हैं।',


      q5:
        'दुकान कहाँ स्थित है?',

      a5:
        'मदुरै मीनाक्षी चंदन दुकान मदुरै, तमिलनाडु में स्थित है। दिशा और दुकान की जानकारी के लिए संपर्क पृष्ठ देखें।',


      marquee:
        'चंदन • पूजा सामग्री • मंदिर की सुगंध • पारंपरिक विश्वास • चंदन • पूजा सामग्री • मंदिर की सुगंध • पारंपरिक विश्वास',


      glanceKicker:
        'हमारे बारे में एक नज़र',

      glanceTitle1:
        'एक परंपरा',

      glanceTitle2:
        'जो सम्मान से आगे बढ़ती है।',

      glanceLead:
        'मदुरै मीनाक्षी चंदन दुकान शुद्धता, भक्ति और पारंपरिक पूजा संस्कृति की आत्मीयता को एक साथ लाती है।',


      rooted:
        'मदुरै में हमारी जड़ें',

      rootedDesc:
        'मदुरै की पवित्र गलियों, मंदिर परंपराओं और धार्मिक विरासत से प्रेरित।',


      pureChoice:
        'शुद्धता हमारी पसंद',

      pureChoiceDesc:
        'हर वस्तु को प्रामाणिकता, गुणवत्ता और पारंपरिक उपयोग को ध्यान में रखकर चुना जाता है।',


      trusted:
        'हर पूजा के लिए भरोसा',

      trustedDesc:
        'दैनिक पूजा से लेकर त्योहारों और पारिवारिक अवसरों तक परंपरा हमेशा हमारे केंद्र में रहती है।',


      tradition:
        'परंपरा'

    }

  };


  /* ==========================================
     GET CURRENT LANGUAGE TEXT
  ========================================== */

  get text() {

    return this.translations[this.language];

  }


  /* ==========================================
     AFTER VIEW INIT
  ========================================== */

  ngAfterViewInit(): void {

    const slides =
      Array.from(
        document.querySelectorAll<HTMLElement>(
          '.hero-slide'
        )
      );


    const dots =
      Array.from(
        document.querySelectorAll<HTMLButtonElement>(
          '.slider-dot'
        )
      );


    const hero =
      document.querySelector<HTMLElement>(
        '.hero'
      );


    const show = (index: number) => {

      if (!slides.length) {
        return;
      }


      this.current =
        (index + slides.length) %
        slides.length;


      slides.forEach(
        (slide, i) => {

          slide.classList.toggle(
            'active',
            i === this.current
          );

        }
      );


      dots.forEach(
        (dot, i) => {

          dot.classList.toggle(
            'active',
            i === this.current
          );

        }
      );


      const copy =
        document.querySelector<HTMLElement>(
          '.hero-copy'
        );


      copy?.classList.remove(
        'hero-visible'
      );


      window.setTimeout(
        () => {

          copy?.classList.add(
            'hero-visible'
          );

        },
        150
      );

    };


    /* ==========================================
       AUTO SLIDER
    ========================================== */

    const start = () => {

      if (this.timer) {

        window.clearInterval(
          this.timer
        );

      }


      this.timer =
        window.setInterval(
          () => {

            show(
              this.current + 1
            );

          },
          6000
        );

    };


    /* ==========================================
       NEXT
    ========================================== */

    document
      .querySelector(
        '.slider-arrow.next'
      )
      ?.addEventListener(
        'click',
        () => {

          show(
            this.current + 1
          );

          start();

        }
      );


    /* ==========================================
       PREVIOUS
    ========================================== */

    document
      .querySelector(
        '.slider-arrow.prev'
      )
      ?.addEventListener(
        'click',
        () => {

          show(
            this.current - 1
          );

          start();

        }
      );


    /* ==========================================
       DOTS
    ========================================== */

    dots.forEach(
      (dot, index) => {

        dot.addEventListener(
          'click',
          () => {

            show(index);

            start();

          }
        );

      }
    );


    /* ==========================================
       PAUSE ON HOVER
    ========================================== */

    hero?.addEventListener(
      'mouseenter',
      () => {

        if (this.timer) {

          window.clearInterval(
            this.timer
          );

        }

      }
    );


    hero?.addEventListener(
      'mouseleave',
      () => {

        start();

      }
    );


    /* ==========================================
       START
    ========================================== */

    show(0);

    start();


    /* ==========================================
       WHY CHOOSE US
    ========================================== */

    this.initWhyChooseAnimation();

  }

private startHeroTyping(): void {

  if (this.typingTimer) {
    clearTimeout(this.typingTimer);
  }

  const element =
    document.getElementById('heroTypingText');

  if (!element) {
    return;
  }

  const fullText = this.text.heroTitle;

  element.textContent = '';

  this.typingIndex = 0;


  const typeNextCharacter = () => {

    if (this.typingIndex < fullText.length) {

      element.textContent +=
        fullText.charAt(this.typingIndex);

      this.typingIndex++;

      this.typingTimer = setTimeout(
        typeNextCharacter,
        70
      );

    }

  };


  typeNextCharacter();

}
  /* ==========================================
     WHY CHOOSE US ANIMATION
  ========================================== */

  private initWhyChooseAnimation(): void {

    const revealItems =
      document.querySelectorAll<HTMLElement>(
        '.reveal-why'
      );


    if (revealItems.length) {

      this.whyObserver =
        new IntersectionObserver(
          (entries) => {

            entries.forEach(
              (entry) => {

                if (
                  entry.isIntersecting
                ) {

                  entry.target.classList.add(
                    'active'
                  );


                  this.whyObserver?.unobserve(
                    entry.target
                  );

                }

              }
            );

          },
          {
            threshold: 0.15
          }
        );


      revealItems.forEach(
        (item, index) => {

          item.style.transitionDelay =
            `${index * 120}ms`;


          this.whyObserver?.observe(
            item
          );

        }
      );

    }


    /* ==========================================
       CENTER CIRCLE
    ========================================== */

    const center =
      document.querySelector<HTMLElement>(
        '.why-center'
      );


    if (center) {

      this.centerObserver =
        new IntersectionObserver(
          (entries) => {

            entries.forEach(
              (entry) => {

                if (
                  entry.isIntersecting
                ) {

                  entry.target.classList.add(
                    'center-active'
                  );


                  this.centerObserver?.unobserve(
                    entry.target
                  );

                }

              }
            );

          },
          {
            threshold: 0.3
          }
        );


      this.centerObserver.observe(
        center
      );

    }

  }


  /* ==========================================
     CLEANUP
  ========================================== */

  ngOnDestroy(): void {

    if (this.timer) {

      window.clearInterval(
        this.timer
      );

    }


    this.whyObserver?.disconnect();

    this.centerObserver?.disconnect();

  }

}