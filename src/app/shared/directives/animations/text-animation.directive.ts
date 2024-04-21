import { Directive } from '@angular/core';
import { gsap } from 'gsap/dist/gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

@Directive({
  selector: '[appTextAnimation]',
  standalone: true
})
export class TextAnimationDirective {

  constructor() { 
    gsap.registerPlugin(ScrollTrigger)
  }

}
