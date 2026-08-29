import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-products',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './products.component.html'
})

export class ProductsComponent implements AfterViewInit {

  @ViewChild('productVideo')
  productVideo!: ElementRef<HTMLVideoElement>;


  activeProductIndex = 0;


  heroProducts = [

{
  name: 'Turmeric Powder',

  tamil: 'மஞ்சள் தூள்',

  tag: 'PURE TURMERIC',

  video: '/assets/turmeric.mp4',

  description:
    'Pure traditional turmeric powder carefully selected for pooja, auspicious rituals and sacred occasions.'
},


    {
      name: 'Kumkum',

      tamil: 'குங்குமம்',

      tag: 'SACRED KUMKUM',

      video: '/assets/kumkum.mp4',

      description:
        'Traditional kumkum prepared for daily worship, temple rituals and auspicious occasions.'
    },
{
  name: 'Ghee',

  tamil: 'நெய்',

  tag: 'PURE GHEE',

  video: '/assets/gee.mp4',

  description:
    'Pure traditional ghee used for deepam, pooja, abhishekam and sacred rituals.'
},
    {
      name: 'Sambrani',

      tamil: 'சாம்பிராணி',

      tag: 'TEMPLE FRAGRANCE',

      video: '/assets/sambrani.mp4',

      description:
        'Traditional sambrani that creates a peaceful and divine temple-like atmosphere.'
    },

{
  name: 'Pathi',

  tamil: 'பத்தி',

  tag: 'DIVINE FRAGRANCE',

  video: '/assets/pathi.mp4',

  description:
    'Traditional fragrant Pathi used during pooja and daily worship to create a peaceful and divine atmosphere.'
},

    {
  name: 'Vilakku',

  tamil: 'விளக்கு',

  tag: 'DIVINE LIGHT',

  video: '/assets/vilakku.mp4',

  description:
    'Traditional pooja lamps that bring sacred light, peace and auspiciousness to every prayer and celebration.'
},
   {
  name: 'Honey',

  tamil: 'தேன்',

  tag: 'PURE HONEY',

  video: '/assets/honey.mp4',

  description:
    'Pure natural honey traditionally used for abhishekam, pooja and sacred offerings.'
},

  ];


  ngAfterViewInit(): void {

    /* existing section reveal animation */

    setTimeout(() => {

      document
        .querySelectorAll(
          '.products-reveal, .product-reveal, .reveal-why'
        )
        .forEach((el) => {

          el.classList.add('active');

        });


      /* start first product video */

      this.playCurrentVideo();

    }, 200);

  }


  selectProduct(index: number): void {

    if (this.activeProductIndex === index) {
      return;
    }


    const video =
      this.productVideo?.nativeElement;


    if (!video) {

      this.activeProductIndex = index;

      return;

    }


    /* fade old video */

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

    const video =
      this.productVideo?.nativeElement;


    if (!video) {
      return;
    }


    video.muted = true;

    video.currentTime = 0;


    video
      .play()
      .catch((error) => {

        console.log(
          'Video autoplay blocked or video not loaded:',
          error
        );

      });

  }

}