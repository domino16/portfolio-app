import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

@Directive({
  selector: '[appScrollImage]',
  standalone: true,
})
export class ScrollImageDirective implements AfterViewInit {
  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    const animation = gsap.from(this.el.nativeElement, {
      filter: 'blur(5px)',
      opacity: 0,
      y: '-30%',
      scrollTrigger: {
        trigger: this.el.nativeElement,
        markers: false,
        scrub: 1,
        start: 'top bottom',
        end: 'top top',
      },
    });
  }
}
