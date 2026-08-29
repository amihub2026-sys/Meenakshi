import {
  AfterViewInit,
  Component,
  OnDestroy
} from '@angular/core';


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html'
})


export class HomeComponent implements AfterViewInit, OnDestroy {

  private timer?: number;

  private current = 0;



  ngAfterViewInit(): void {

    const slides =
      Array.from(
        document.querySelectorAll<HTMLElement>('.hero-slide')
      );


    const dots =
      Array.from(
        document.querySelectorAll<HTMLButtonElement>('.slider-dot')
      );


    const hero =
      document.querySelector<HTMLElement>('.hero');



    const show = (index: number) => {

      if (!slides.length) {
        return;
      }


      this.current =
        (index + slides.length) % slides.length;


      slides.forEach((slide, i) => {

        slide.classList.toggle(
          'active',
          i === this.current
        );

      });


      dots.forEach((dot, i) => {

        dot.classList.toggle(
          'active',
          i === this.current
        );

      });



      const copy =
        document.querySelector<HTMLElement>('.hero-copy');


      copy?.classList.remove('hero-visible');


      window.setTimeout(() => {

        copy?.classList.add('hero-visible');

      }, 150);

    };



    const start = () => {

      if (this.timer) {

        window.clearInterval(
          this.timer
        );

      }


      this.timer =
        window.setInterval(() => {

          show(
            this.current + 1
          );

        }, 6000);

    };



    /* ============================
       NEXT BUTTON
    ============================ */

    document
      .querySelector('.slider-arrow.next')
      ?.addEventListener(
        'click',
        () => {

          show(
            this.current + 1
          );

          start();

        }
      );



    /* ============================
       PREVIOUS BUTTON
    ============================ */

    document
      .querySelector('.slider-arrow.prev')
      ?.addEventListener(
        'click',
        () => {

          show(
            this.current - 1
          );

          start();

        }
      );



    /* ============================
       DOT BUTTONS
    ============================ */

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



    /* ============================
       PAUSE ON HOVER
    ============================ */

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



    /* ============================
       START HERO
    ============================ */

    show(0);

    start();



    /* ============================
       START TAMIL TYPING
    ============================ */

    this.typeTamil();



    /* ============================
       WHY CHOOSE US ANIMATION
    ============================ */

    this.initWhyChooseAnimation();

  }



  /* ==========================================
     TAMIL TYPING EFFECT
  ========================================== */

  private typeTamil(): void {

    const el =
      document.getElementById(
        'tamilTyping'
      );


    if (!el) {
      return;
    }



    const first =
      '“அங்கயற்கண்ணி அருளால் ';


    const second =
      'அனைவரின் இல்லங்களிலும் மங்களம் பெருகட்டும்.”';


    const full =
      first + second;


    let i = 0;



    const type = () => {

      const firstTyped =
        full
          .substring(0, i)
          .substring(
            0,
            first.length
          );


      const secondTyped =
        i > first.length
          ? full.substring(
              first.length,
              i
            )
          : '';


      el.innerHTML =
        firstTyped +
        '<span class="gold-text">' +
        secondTyped +
        '</span>';


      i++;


      if (i <= full.length) {

        window.setTimeout(
          type,
          80
        );

      }

    };


    type();

  }



  /* ==========================================
     WHY CHOOSE US REVEAL ANIMATION
  ========================================== */

  private initWhyChooseAnimation(): void {

    const revealItems =
      document.querySelectorAll<HTMLElement>(
        '.reveal-why'
      );


    if (!revealItems.length) {
      return;
    }



    const observer =
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


                observer.unobserve(
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


        observer.observe(
          item
        );

      }
    );



    /* ============================
       CENTER CIRCLE ANIMATION
    ============================ */

    const center =
      document.querySelector<HTMLElement>(
        '.why-center'
      );


    if (center) {

      const centerObserver =
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


                  centerObserver.unobserve(
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


      centerObserver.observe(
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

  }

}