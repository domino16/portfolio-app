import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

@Directive({
  selector: '[appHeadingScroll]',
  standalone: true,
})
export class HeadingScrollDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(this.el.nativeElement, {
      backgroundPositionX: '0%',
      scrollTrigger: {
        trigger: this.el.nativeElement,
        markers: false,
        scrub: 1,
        start: 'top-=80px bottom',
        end: 'bottom center',
      },
      ease: 'power1.inOut',
    });

    gsap.from(this.el.nativeElement, {
      x: '30%',
      scrollTrigger: {
        trigger: this.el.nativeElement,
        markers: false,
        scrub: 1,
        start: 'center bottom',
        end: 'bottom+=200 center',
      },
      ease: 'power1.out',
    });
  }
}
