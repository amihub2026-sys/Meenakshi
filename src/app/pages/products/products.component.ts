

import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import {
  Language,
  LanguageService
} from '../../services/language.service';

import {
  CartService
} from '../../services/cart';

import {
  Product,
  ProductService
} from '../../services/product';

import {
  Category,
  CategoryService
} from '../../services/category.service';
interface HeroProduct {
  nameEn: string;
  nameTa: string;
  nameHi: string;

  tagEn: string;
  tagTa: string;
  tagHi: string;

  video: string;

  descriptionEn: string;
  descriptionTa: string;
  descriptionHi: string;
}


@Component({
  selector: 'app-products',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './products.component.html'
})
export class ProductsComponent
  implements OnInit, AfterViewInit {

  /*
   * Backend products:
   * These products appear only in the bottom shopping section.
   */
  products: Product[] = [];
private readonly route = inject(ActivatedRoute);
private readonly destroyRef = inject(DestroyRef);

private categoriesReady = false;
private productRequest?: Subscription;
  productsLoading = false;
  productsError = '';
  categories: Category[] = [];
categoriesLoading = false;
allProducts: Product[] = [];
selectedCategoryId = '';
snackbarMessage = '';
showSnackbar = false;
currentPage = 1;
readonly pageSize = 12;
private snackbarTimer?: ReturnType<typeof setTimeout>;

  /*
   * Static cinematic section state
   */
  activeProductIndex = 0;

  @ViewChild('productVideo')
  productVideo?: ElementRef<HTMLVideoElement>;


  language: Language = 'ta';

selectedProduct: any = null;
selectedVariant: any = null;
cardSelectedVariants: {
  [productId: string]: any
} = {};
showCartSnackbar(): void {
  clearTimeout(this.snackbarTimer);

this.snackbarMessage = 'Product added to cart';
  this.showSnackbar = true;

  this.snackbarTimer = setTimeout(() => {
    this.showSnackbar = false;
  }, 3000);
}
openProductDetails(product: any): void {

  this.selectedProduct = product;


   if (
    product.variants &&
    product.variants.length > 0
  ) {
    this.selectedVariant = product.variants[0];
  } else {
    this.selectedVariant = null;
  }


}
selectVariant(variant: any): void {
  this.selectedVariant = variant;
}
get totalPages(): number {
  return Math.ceil(this.products.length / this.pageSize);
}

get paginatedProducts(): Product[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.products.slice(start, start + this.pageSize);
}

get pageNumbers(): (number | null)[] {
  const total = this.totalPages;

  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const visible = new Set<number>([1, total]);

  const start = Math.max(2, this.currentPage - 1);
  const end = Math.min(total - 1, this.currentPage + 1);

  for (let page = start; page <= end; page++) {
    visible.add(page);
  }

  if (this.currentPage <= 3) {
    visible.add(2);
    visible.add(3);
  }

  if (this.currentPage >= total - 2) {
    visible.add(total - 1);
    visible.add(total - 2);
  }

  const pages = [...visible].sort((a, b) => a - b);
  const result: (number | null)[] = [];

  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) {
      result.push(null);
    }

    result.push(page);
  });

  return result;
}

goToPage(page: number): void {
  if (
    page < 1 ||
    page > this.totalPages ||
    page === this.currentPage
  ) {
    return;
  }

  this.currentPage = page;

  document.getElementById('product-results')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}
addToCart(product: Product): void {
  if (
    !product.isActive ||
    !this.selectedVariant ||
    this.isProductAdded(product)
  ) {
    return;
  }

  this.cartService.addProduct(
    product,
    this.selectedVariant
  );

  this.showCartSnackbar();
}
closeProductDetails(): void {

  this.selectedProduct = null;

  document.body.style.overflow = '';

}
  translations = {
    en: {
      heroKicker: 'OUR SACRED COLLECTION',
      heroTitle1: 'Products of',
      heroTitle2: 'Tradition',

      collectionLabel: 'OUR COLLECTION',
      collectionTitle1: 'Sacred essentials,',
      collectionTitle2: 'beautifully selected.',
      collectionDesc:
        'Traditional santhanam and pooja essentials chosen with care for everyday worship, temple visits and auspicious occasions.',

      productCategory: 'SACRED PRODUCT',
      price: 'Price',
      loading: 'Loading products...',
      empty: 'No products are currently available.',
      error:
        'Unable to load products. Please try again.',
      addToCart: 'Add to Cart',
      productAdded: 'Product Added',
   viewDetails: 'View Details',
    },

    ta: {
      heroKicker: 'எங்கள் புனிதத் தொகுப்பு',
      heroTitle1: 'பாரம்பரியத்தின்',
      heroTitle2: 'புனிதப் பொருட்கள்',

      collectionLabel: 'எங்கள் தொகுப்பு',
      collectionTitle1:
        'புனிதமான பூஜைப் பொருட்கள்,',
      collectionTitle2:
        'அக்கறையுடன் தேர்ந்தெடுக்கப்பட்டவை.',
      collectionDesc:
        'தினசரி வழிபாடு, கோவில் தரிசனம் மற்றும் சுபநிகழ்வுகளுக்காக கவனமாக தேர்ந்தெடுக்கப்பட்ட பாரம்பரிய சந்தனம் மற்றும் பூஜைப் பொருட்கள்.',

      productCategory: 'புனிதப் பொருள்',
      price: 'விலை',
      loading: 'பொருட்கள் ஏற்றப்படுகின்றன...',
      empty:
        'தற்போது பொருட்கள் எதுவும் கிடைக்கவில்லை.',
      error:
        'பொருட்களை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
      addToCart: 'கூடையில் சேர்',
      productAdded: 'கூடையில் சேர்க்கப்பட்டது',
  viewDetails: 'விவரங்களை காண்க',
    },

    hi: {
      heroKicker: 'हमारा पवित्र संग्रह',
      heroTitle1: 'परंपरा से जुड़े',
      heroTitle2: 'पवित्र उत्पाद',

      collectionLabel: 'हमारा संग्रह',
      collectionTitle1: 'पवित्र पूजा सामग्री,',
      collectionTitle2: 'सावधानी से चुनी गई।',
      collectionDesc:
        'दैनिक पूजा, मंदिर दर्शन और शुभ अवसरों के लिए सावधानी से चुनी गई पारंपरिक पूजा सामग्री।',

      productCategory: 'पवित्र उत्पाद',
      price: 'कीमत',
      loading: 'उत्पाद लोड हो रहे हैं...',
      empty:
        'वर्तमान में कोई उत्पाद उपलब्ध नहीं है।',
      error:
        'उत्पाद लोड नहीं हो सके। कृपया पुनः प्रयास करें।',
      addToCart: 'कार्ट में जोड़ें',
      productAdded: 'उत्पाद जोड़ा गया',
 viewDetails: 'विवरण देखें',
    }
  };


  /*
   * Static products:
   * These products appear only in the top cinematic section.
   * Backend changes will not affect this array.
   */
  heroProducts: HeroProduct[] = [
    {
      nameEn: 'Turmeric Powder',
      nameTa: 'மஞ்சள் தூள்',
      nameHi: 'हल्दी पाउडर',

      tagEn: 'PURE TURMERIC',
      tagTa: 'தூய மஞ்சள்',
      tagHi: 'शुद्ध हल्दी',

      video: '/assets/turmeric.mp4',

      descriptionEn:
        'Pure traditional turmeric powder carefully selected for pooja, auspicious rituals and sacred occasions.',

      descriptionTa:
        'பூஜை, மங்களகரமான சடங்குகள் மற்றும் புனித நிகழ்வுகளுக்காக கவனமாக தேர்ந்தெடுக்கப்பட்ட தூய பாரம்பரிய மஞ்சள் தூள்.',

      descriptionHi:
        'पूजा, शुभ अनुष्ठानों और पवित्र अवसरों के लिए सावधानी से चुना गया शुद्ध पारंपरिक हल्दी पाउडर।'
    },

    {
      nameEn: 'Kumkum',
      nameTa: 'குங்குமம்',
      nameHi: 'कुमकुम',

      tagEn: 'SACRED KUMKUM',
      tagTa: 'புனித குங்குமம்',
      tagHi: 'पवित्र कुमकुम',

      video: '/assets/kumkum.mp4',

      descriptionEn:
        'Traditional kumkum prepared for daily worship, temple rituals and auspicious occasions.',

      descriptionTa:
        'தினசரி வழிபாடு, கோவில் சடங்குகள் மற்றும் சுபநிகழ்வுகளுக்காக தயாரிக்கப்பட்ட பாரம்பரிய குங்குமம்.',

      descriptionHi:
        'दैनिक पूजा, मंदिर अनुष्ठानों और शुभ अवसरों के लिए तैयार पारंपरिक कुमकुम।'
    },

    {
      nameEn: 'Ghee',
      nameTa: 'நெய்',
      nameHi: 'घी',

      tagEn: 'PURE GHEE',
      tagTa: 'தூய நெய்',
      tagHi: 'शुद्ध घी',

      video: '/assets/gee.mp4',

      descriptionEn:
        'Pure traditional ghee used for deepam, pooja, abhishekam and sacred rituals.',

      descriptionTa:
        'தீபம், பூஜை, அபிஷேகம் மற்றும் புனித சடங்குகளுக்குப் பயன்படுத்தப்படும் தூய பாரம்பரிய நெய்.',

      descriptionHi:
        'दीपक, पूजा, अभिषेक और पवित्र अनुष्ठानों के लिए उपयोग किया जाने वाला शुद्ध पारंपरिक घी।'
    },

    {
      nameEn: 'Sambrani',
      nameTa: 'சாம்பிராணி',
      nameHi: 'साम्ब्राणी',

      tagEn: 'TEMPLE FRAGRANCE',
      tagTa: 'கோவில் மணம்',
      tagHi: 'मंदिर की सुगंध',

      video: '/assets/sambrani.mp4',

      descriptionEn:
        'Traditional sambrani that creates a peaceful and divine temple-like atmosphere.',

      descriptionTa:
        'கோவில் போன்ற அமைதியான மற்றும் தெய்வீகமான சூழலை உருவாக்கும் பாரம்பரிய சாம்பிராணி.',

      descriptionHi:
        'पारंपरिक साम्ब्राणी जो शांत और दिव्य मंदिर जैसा वातावरण बनाती है।'
    },

    {
      nameEn: 'Pathi',
      nameTa: 'பத்தி',
      nameHi: 'अगरबत्ती',

      tagEn: 'DIVINE FRAGRANCE',
      tagTa: 'தெய்வீக மணம்',
      tagHi: 'दिव्य सुगंध',

      video: '/assets/pathi.mp4',

      descriptionEn:
        'Traditional fragrant Pathi used during pooja and daily worship to create a peaceful and divine atmosphere.',

      descriptionTa:
        'பூஜை மற்றும் தினசரி வழிபாட்டின்போது அமைதியான தெய்வீக சூழலை உருவாக்க பயன்படுத்தப்படும் பாரம்பரிய பத்தி.',

      descriptionHi:
        'पूजा और दैनिक उपासना के दौरान शांत और दिव्य वातावरण बनाने के लिए उपयोग की जाने वाली पारंपरिक अगरबत्ती।'
    },

    {
      nameEn: 'Vilakku',
      nameTa: 'விளக்கு',
      nameHi: 'पूजा दीपक',

      tagEn: 'DIVINE LIGHT',
      tagTa: 'தெய்வீக ஒளி',
      tagHi: 'दिव्य प्रकाश',

      video: '/assets/vilakku.mp4',

      descriptionEn:
        'Traditional pooja lamps that bring sacred light, peace and auspiciousness to every prayer and celebration.',

      descriptionTa:
        'ஒவ்வொரு பூஜை மற்றும் கொண்டாட்டத்திற்கும் புனித ஒளி, அமைதி மற்றும் மங்களத்தை கொண்டு வரும் பாரம்பரிய விளக்குகள்.',

      descriptionHi:
        'पारंपरिक पूजा दीपक जो हर प्रार्थना और उत्सव में पवित्र प्रकाश, शांति और शुभता लाते हैं।'
    },

    {
      nameEn: 'Honey',
      nameTa: 'தேன்',
      nameHi: 'शहद',

      tagEn: 'PURE HONEY',
      tagTa: 'தூய தேன்',
      tagHi: 'शुद्ध शहद',

      video: '/assets/honey.mp4',

      descriptionEn:
        'Pure natural honey traditionally used for abhishekam, pooja and sacred offerings.',

      descriptionTa:
        'அபிஷேகம், பூஜை மற்றும் புனித அர்ப்பணிப்புகளுக்குப் பாரம்பரியமாக பயன்படுத்தப்படும் தூய இயற்கை தேன்.',

      descriptionHi:
        'अभिषेक, पूजा और पवित्र अर्पण के लिए पारंपरिक रूप से उपयोग किया जाने वाला शुद्ध प्राकृतिक शहद।'
    }
  ];


  constructor(
    private languageService: LanguageService,
    private productService: ProductService,
    private cartService: CartService,
      private categoryService: CategoryService,
      private router: Router
  ) {
    this.languageService.language$.subscribe(
      (lang: Language) => {
        this.language = lang;
      }
    );
  }


  get text() {
    return this.translations[this.language];
  }

ngOnInit(): void {
  this.route.queryParamMap
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      if (this.categoriesReady) {
        this.applyCategoryFromUrl();
      }
    });

  this.loadCategories();

  this.destroyRef.onDestroy(() => {
    this.productRequest?.unsubscribe();
  });
}

  ngAfterViewInit(): void {
    this.activateRevealElements();

    setTimeout(() => {
      this.playCurrentVideo();
    }, 200);
  }

loadCategories(): void {
  this.categoriesLoading = true;

  this.categoryService
    .getCategories()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (categories) => {
        this.categories = categories.filter(
          category => category.isActive
        );

        this.categoriesLoading = false;
        this.categoriesReady = true;

        this.applyCategoryFromUrl();
      },

      error: (error) => {
        console.error('Unable to load categories:', error);

        this.categories = [];
        this.categoriesLoading = false;
        this.productsLoading = false;
        this.productsError = this.text.error;
      }
    });
}

private normalizeCategoryName(value: string): string {
  return value
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\s+/g, ' ');
}

private applyCategoryFromUrl(): void {
  const params = this.route.snapshot.queryParamMap;

const categoryId =
  params.get('categoryId') ||
  params.get('category') ||
  '';
  const categoryName = params.get('categoryName') ?? '';

  // Products page opened without a category.
  if (!categoryId && !categoryName) {
    this.selectedCategoryId = '';
    this.loadProducts();
    return;
  }

  const normalizedName =
    this.normalizeCategoryName(categoryName);

  const category = categoryId
    ? this.categories.find(item => item._id === categoryId)
    : this.categories.find(
        item =>
          this.normalizeCategoryName(item.name.en) ===
          normalizedName
      );

  if (!category?._id) {
    this.productRequest?.unsubscribe();

    this.selectedCategoryId = '';
    this.products = [];
    this.productsLoading = false;

    this.productsError =
      this.language === 'ta'
        ? 'இந்த வகை தற்போது கிடைக்கவில்லை.'
        : this.language === 'hi'
          ? 'यह श्रेणी अभी उपलब्ध नहीं है।'
          : 'This category is currently unavailable.';

    return;
  }

  this.selectedCategoryId = category._id;
  this.loadProducts(category._id);
}
selectCategory(categoryId: string): void {
  if (!categoryId) {
    return;
  }

  void this.router.navigate([], {
    relativeTo: this.route,
    queryParams: {
      categoryId: categoryId,
      category: null,
      categoryName: null
    },
    queryParamsHandling: 'merge'
  });
}

showAllProducts(): void {
  void this.router.navigate([], {
    relativeTo: this.route,
   queryParams: {
  categoryId: null,
  category: null,
  categoryName: null
},
    queryParamsHandling: 'merge'
  });
}


getCategoryName(
  category: Category
): string {

  if (this.language === 'ta') {
    return category.name.ta;
  }

  if (this.language === 'hi') {
    return category.name.hi;
  }

  return category.name.en;
}
  /*
   * Backend products are loaded only into this.products.
   * Do not assign backend products to heroProducts.
   */
loadProducts(categoryId: string = ''): void {
  this.productRequest?.unsubscribe();

  this.currentPage = 1;
  this.productsLoading = true;
  this.productsError = '';
  this.products = [];

  this.productRequest = this.productService
    .getProducts(categoryId)
    .subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.productsLoading = false;
        this.activateRevealElements();
      },

      error: error => {
        console.error('Unable to load products:', error);

        this.products = [];
        this.productsLoading = false;
        this.productsError = this.text.error;
      }
    });
}
  /*
   * Top static cinematic product selection
   */
  selectProduct(index: number): void {
    if (
      index < 0 ||
      index >= this.heroProducts.length ||
      this.activeProductIndex === index
    ) {
      return;
    }

    const video = this.productVideo?.nativeElement;

    if (!video) {
      this.activeProductIndex = index;
      return;
    }

    video.classList.add('changing');

    setTimeout(() => {
      this.activeProductIndex = index;

      setTimeout(() => {
        video.load();
        this.playCurrentVideo();
        video.classList.remove('changing');
      }, 100);
    }, 350);
  }


  private playCurrentVideo(): void {
    const video = this.productVideo?.nativeElement;

    if (!video) {
      return;
    }

    video.muted = true;
    video.currentTime = 0;

    video.play().catch(error => {
      console.log(
        'Video autoplay blocked or video not loaded:',
        error
      );
    });
  }


  /*
   * Static top-section product helpers
   */
  getProductName(product: HeroProduct): string {
    if (this.language === 'ta') {
      return product.nameTa;
    }

    if (this.language === 'hi') {
      return product.nameHi;
    }

    return product.nameEn;
  }


  getProductTag(product: HeroProduct): string {
    if (this.language === 'ta') {
      return product.tagTa;
    }

    if (this.language === 'hi') {
      return product.tagHi;
    }

    return product.tagEn;
  }


  getProductDescription(
    product: HeroProduct
  ): string {
    if (this.language === 'ta') {
      return product.descriptionTa;
    }

    if (this.language === 'hi') {
      return product.descriptionHi;
    }

    return product.descriptionEn;
  }


  /*
   * Bottom backend shopping-section helpers
   */
  getBackendProductName(product: Product): string {
    if (this.language === 'ta') {
      return product.name.ta;
    }

    if (this.language === 'hi') {
      return product.name.hi;
    }

    return product.name.en;
  }


  getSecondaryName(product: Product): string {
    if (this.language === 'ta') {
      return product.name.en;
    }

    return product.name.ta;
  }


 


  isProductAdded(product: Product): boolean {
    return (
      this.cartService.getProductQuantity(
        product._id
      ) > 0
    );
  }
  getCardSelectedVariant(product: any): any {

  if (!product) {
    return null;
  }

  const productId =
    product._id ||
    product.id;

  if (
    productId &&
    this.cardSelectedVariants[productId]
  ) {
    return this.cardSelectedVariants[productId];
  }

  if (
    product.variants &&
    product.variants.length > 0
  ) {
    return product.variants[0];
  }

  return null;
}


selectCardVariant(
  product: any,
  variant: any
): void {

  const productId =
    product._id ||
    product.id;

  if (!productId) {
    return;
  }

  this.cardSelectedVariants[productId] =
    variant;
}


getCardPrice(product: any): number {

  const selectedVariant =
    this.getCardSelectedVariant(product);

  if (
    selectedVariant &&
    selectedVariant.price != null
  ) {
    return Number(selectedVariant.price);
  }

  return Number(product.price || 0);
}
addCardProductToCart(product: Product): void {
  if (!product || !product.isActive) {
    return;
  }

  const variant = this.getCardSelectedVariant(product);

  if (!variant) {
    return;
  }

  this.cartService.addProduct(product, variant);

  this.showCartSnackbar();
}



  trackBackendProduct(
    _index: number,
    product: Product
  ): string {
    return product._id;
  }


  private activateRevealElements(): void {
    setTimeout(() => {
      document
        .querySelectorAll(
          '.products-reveal, ' +
          '.product-reveal, ' +
          '.reveal-why'
        )
        .forEach(element => {
          element.classList.add('active');
        });
    }, 200);
  }
}