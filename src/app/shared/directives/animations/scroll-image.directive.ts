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
    const animation = gsap.to(this.el.nativeElement, {
      y: '0',
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
