import { Directive, ElementRef } from '@angular/core';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

@Directive({
  selector: '[appTextAnimation]',
  standalone: true,
})
export class TextAnimationDirective {
  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    const animation = gsap.to(this.el.nativeElement, {
      opacity: 1,
      y: '0',
      duration: 0.7,
      delay: 2.5,
    });

    // animation.pause().progress(0);

    ScrollTrigger.create({
      trigger: this.el.nativeElement,
      markers: true,
      end: 'top bottom',
      start: 'top bottom',

      onEnter: () => animation.play(),
      onEnterBack: () => {
        animation.progress(0);
        animation.pause();
      },
    });
  }
}
