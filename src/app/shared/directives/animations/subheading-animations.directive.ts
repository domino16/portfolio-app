import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { delay } from 'rxjs';
@Directive({
  selector: '[appSubheadingAnimations]',
  standalone: true,
})
export class SubheadingAnimationsDirective implements AfterViewInit {
  element: HTMLElement;

  constructor(private el: ElementRef) {
    this.element = this.el.nativeElement as HTMLElement;
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    const isPaused = !this.element.classList.contains('subheader');
    const delay = isPaused ? 0 : 3;

    console.log(isPaused);
    const animation = gsap.to(this.element, {
      height: '100%',
      opacity: 1,
      duration: 5.4,
      ease: 'power1.out',
      paused: isPaused,
      delay: delay,
    });

    ScrollTrigger.create({
      trigger: this.element,
      markers: true,
      start: 'top-=100px bottom',
      end: 'bottom+=30px bottom',
      onLeave: () => animation.play(),
      onLeaveBack: () => animation.progress(0).pause(),
    });
  }
}
