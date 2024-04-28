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
    const animation = gsap.to(this.el.nativeElement.children, {
      opacity: 1,
      y: '0',
      duration: 0.7,
      stagger: 0.2,
      paused: true,
    });

    ScrollTrigger.create({
      trigger: this.el.nativeElement,
      markers: false,
      end: 'bottom-=30% top',
      start: 'top-=30% bottom',

      onEnter: () => animation.play(),
      onLeaveBack: () => {
        animation.progress(0);
        animation.pause();
      },
    });
  }
}
