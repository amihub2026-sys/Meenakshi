import { Component } from '@angular/core';

import {
  Language,
  LanguageService
} from '../../services/language.service';

@Component({
  selector: 'app-specials',
  standalone: true,
  templateUrl: './specials.component.html'
})
export class SpecialsComponent {

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
      traditionLabel: 'OUR TRADITION',
      traditionTitle1: 'Inspired by the sacred',
      traditionTitle2: 'spirit of Madurai.',
      traditionLead:
        'Our store reflects the familiar warmth of temple streets, sandal fragrance, brass lamps and traditional pooja essentials.',
      traditionDesc:
        'The green and gold palette is inspired by auspicious traditions, creating a calm and welcoming identity that feels authentic, elegant and timeless.',

      traditionalSelection: 'Traditional Selection',
      traditionalSelectionDesc:
        'Carefully chosen essentials for worship, temple visits and auspicious occasions.',

      bulkOrders: 'Bulk Pooja Orders',
      bulkOrdersDesc:
        'Suitable for temples, family functions, special events and devotional gifting.',

      enquireBulk: 'Enquire for Bulk Orders',

      journeyKicker: 'FROM NATURE TO DEVOTION',
      journeyTitle1: 'The Journey of',
      journeyTitle2: 'Pure Santhanam',
      journeyDesc:
        'Carefully prepared through tradition, purity and generations of trust.',

      sandalwood: 'Sandalwood',
      sandalwoodDesc:
        'The journey begins with carefully selected pure sandalwood.',

      sandalPowder: 'Sandal Powder',
      sandalPowderDesc:
        'Sandalwood is finely prepared while preserving its natural fragrance.',

      sandalPaste: 'Sandal Paste',
      sandalPasteDesc:
        'Pure sandal becomes a smooth sacred paste for pooja and worship.',

      generations: 'Trusted by Generations',
      generationsDesc:
        'Families choose our store with confidence for authentic Santhanam.',

      visionLabel: 'OUR VISION',
      visionTitle1: 'Preserving tradition',
      visionTitle2: 'for generations.',
      visionDesc:
        'To preserve the authentic traditions of Madurai by bringing pure Santhanam and trusted pooja essentials into every home, keeping devotion and cultural values alive for generations.',

      missionLabel: 'OUR MISSION',
      missionTitle1: 'Purity in every',
      missionTitle2: 'sacred offering.',
      missionDesc:
        'To carefully provide authentic, quality and traditional pooja products with the trust, personal care and values that Madurai Meenakshi Santhana Kadai stands for.'
    },


    ta: {
      traditionLabel: 'எங்கள் பாரம்பரியம்',
      traditionTitle1: 'மதுரையின் புனித',
      traditionTitle2: 'ஆன்மிக உணர்வால் ஈர்க்கப்பட்டது.',
      traditionLead:
        'கோவில் வீதிகள், சந்தன மணம், பித்தளை விளக்குகள் மற்றும் பாரம்பரிய பூஜைப் பொருட்களின் நெருக்கத்தை எங்கள் கடை பிரதிபலிக்கிறது.',
      traditionDesc:
        'பச்சை மற்றும் தங்க நிற அமைப்பு மங்களகரமான பாரம்பரியங்களால் ஈர்க்கப்பட்டு, அமைதியான, உண்மையான மற்றும் காலத்தால் அழியாத தோற்றத்தை உருவாக்குகிறது.',

      traditionalSelection: 'பாரம்பரிய தேர்வு',
      traditionalSelectionDesc:
        'வழிபாடு, கோவில் தரிசனம் மற்றும் சுபநிகழ்வுகளுக்காக கவனமாக தேர்ந்தெடுக்கப்பட்ட பொருட்கள்.',

      bulkOrders: 'மொத்த பூஜை ஆர்டர்கள்',
      bulkOrdersDesc:
        'கோவில்கள், குடும்ப நிகழ்ச்சிகள், சிறப்பு விழாக்கள் மற்றும் பக்தி பரிசுகளுக்கு ஏற்றது.',

      enquireBulk: 'மொத்த ஆர்டருக்கு தொடர்பு கொள்ளவும்',

      journeyKicker: 'இயற்கையிலிருந்து பக்திக்கு',
      journeyTitle1: 'தூய சந்தனத்தின்',
      journeyTitle2: 'புனிதப் பயணம்',
      journeyDesc:
        'பாரம்பரியம், தூய்மை மற்றும் தலைமுறைகளின் நம்பிக்கையுடன் கவனமாக தயாரிக்கப்படுகிறது.',

      sandalwood: 'சந்தன மரம்',
      sandalwoodDesc:
        'கவனமாக தேர்ந்தெடுக்கப்பட்ட தூய சந்தன மரத்திலிருந்து இந்த பயணம் தொடங்குகிறது.',

      sandalPowder: 'சந்தனத் தூள்',
      sandalPowderDesc:
        'இயற்கை மணத்தை பாதுகாத்தபடி சந்தனம் நன்றாக அரைக்கப்படுகிறது.',

      sandalPaste: 'சந்தனப் பேஸ்ட்',
      sandalPasteDesc:
        'தூய சந்தனம் பூஜை மற்றும் வழிபாட்டிற்கான மென்மையான புனித பேஸ்டாக தயாரிக்கப்படுகிறது.',

      generations: 'தலைமுறைகளின் நம்பிக்கை',
      generationsDesc:
        'உண்மையான சந்தனத்திற்காக குடும்பங்கள் தலைமுறைகளாக எங்கள் கடையை நம்புகின்றனர்.',

      visionLabel: 'எங்கள் நோக்கம்',
      visionTitle1: 'பாரம்பரியத்தை பாதுகாத்து',
      visionTitle2: 'தலைமுறைகளுக்கு கொண்டு செல்லுதல்.',
      visionDesc:
        'தூய சந்தனம் மற்றும் நம்பகமான பூஜைப் பொருட்களை ஒவ்வொரு இல்லத்திற்கும் கொண்டு சென்று மதுரையின் உண்மையான பாரம்பரியத்தையும் பக்தி மதிப்புகளையும் தலைமுறைகளுக்கு பாதுகாப்பதே எங்கள் நோக்கம்.',

      missionLabel: 'எங்கள் பணி',
      missionTitle1: 'ஒவ்வொரு புனித அர்ப்பணிப்பிலும்',
      missionTitle2: 'தூய்மை.',
      missionDesc:
        'மதுரை மீனாட்சி சந்தனக் கடையின் நம்பிக்கை, தனிப்பட்ட அக்கறை மற்றும் பாரம்பரிய மதிப்புகளுடன் தரமான உண்மையான பூஜைப் பொருட்களை வழங்குவதே எங்கள் பணி.'
    },


    hi: {
      traditionLabel: 'हमारी परंपरा',
      traditionTitle1: 'मदुरै की पवित्र',
      traditionTitle2: 'आध्यात्मिक भावना से प्रेरित।',
      traditionLead:
        'हमारी दुकान मंदिर की गलियों, चंदन की सुगंध, पीतल के दीपक और पारंपरिक पूजा सामग्री की आत्मीयता को दर्शाती है।',
      traditionDesc:
        'हरा और सुनहरा रंग शुभ परंपराओं से प्रेरित है, जो शांत, प्रामाणिक, सुंदर और कालातीत पहचान बनाता है।',

      traditionalSelection: 'पारंपरिक चयन',
      traditionalSelectionDesc:
        'पूजा, मंदिर दर्शन और शुभ अवसरों के लिए सावधानी से चुनी गई सामग्री।',

      bulkOrders: 'थोक पूजा ऑर्डर',
      bulkOrdersDesc:
        'मंदिरों, पारिवारिक समारोहों, विशेष आयोजनों और धार्मिक उपहारों के लिए उपयुक्त।',

      enquireBulk: 'थोक ऑर्डर के लिए संपर्क करें',

      journeyKicker: 'प्रकृति से भक्ति तक',
      journeyTitle1: 'शुद्ध चंदन की',
      journeyTitle2: 'पवित्र यात्रा',
      journeyDesc:
        'परंपरा, शुद्धता और पीढ़ियों के विश्वास के साथ सावधानी से तैयार किया जाता है।',

      sandalwood: 'चंदन की लकड़ी',
      sandalwoodDesc:
        'यह यात्रा सावधानी से चुनी गई शुद्ध चंदन की लकड़ी से शुरू होती है।',

      sandalPowder: 'चंदन पाउडर',
      sandalPowderDesc:
        'चंदन को उसकी प्राकृतिक सुगंध बनाए रखते हुए बारीकी से तैयार किया जाता है।',

      sandalPaste: 'चंदन लेप',
      sandalPasteDesc:
        'शुद्ध चंदन पूजा और उपासना के लिए मुलायम पवित्र लेप में बदलता है।',

      generations: 'पीढ़ियों का विश्वास',
      generationsDesc:
        'प्रामाणिक चंदन के लिए परिवार पीढ़ियों से हमारी दुकान पर भरोसा करते हैं।',

      visionLabel: 'हमारा विज़न',
      visionTitle1: 'परंपरा को सुरक्षित रखना',
      visionTitle2: 'आने वाली पीढ़ियों के लिए।',
      visionDesc:
        'शुद्ध चंदन और विश्वसनीय पूजा सामग्री को हर घर तक पहुँचाकर मदुरै की प्रामाणिक परंपराओं, भक्ति और सांस्कृतिक मूल्यों को पीढ़ियों तक जीवित रखना।',

      missionLabel: 'हमारा मिशन',
      missionTitle1: 'हर पवित्र अर्पण में',
      missionTitle2: 'शुद्धता।',
      missionDesc:
        'मदुरै मीनाक्षी चंदन दुकान के विश्वास, व्यक्तिगत देखभाल और पारंपरिक मूल्यों के साथ प्रामाणिक और गुणवत्तापूर्ण पूजा सामग्री प्रदान करना।'
    }

  };


  get text() {
    return this.translations[this.language];
  }

}