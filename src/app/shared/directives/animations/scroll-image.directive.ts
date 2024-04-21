import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

@Directive({
  selector: '[appScrollImage]',
  standalone: true,
})
export class ScrollImageDirective implements AfterViewInit {
  constructor(private el:ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    const animation = gsap.to(this.el.nativeElement, {

      scrollTrigger:{
        markers:true,
        start:
      }
    } )
  }

}
