import {
  Directive,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import { gsap } from 'gsap';
import { Router } from '@angular/router';

class CursorOptions {
  speed?: number;
  ease?: string;
  visibleTimeout?: number;
  scroller?: {
    selector: string;
    scrollType: 'normal' | 'transform';
  };
}

@Directive({
  selector: '[appMagneticCursor]',
  standalone: true,
})
export class MagneticCursorDirective implements OnInit {
  cursorEl!: HTMLElement;
  cursorTextEl!: HTMLDivElement;
  hostEl!: HTMLElement;
  visible!: boolean;
  cursorStoppedTimer!: ReturnType<typeof setTimeout>;

  #pos!: {
    x: number;
    y: number;
  };
  #visibleInt: any;
  #stick: any;

  @Input() options: CursorOptions = {
    speed: 0.7,
    ease: 'expo.out',
    visibleTimeout: 300,
    scroller: {
      selector: 'body',
      scrollType: 'normal',
    },
  };

  constructor(private elRef: ElementRef, private router: Router) {
    this.cursorEl = this.elRef.nativeElement;
  }

  ngOnInit(): void {
    this.cursorTextEl = this.cursorEl.children[0] as HTMLDivElement;
    this.router.events.subscribe((event) => {
      //events.type 1 is navigationEnd
      if (event.type === 1) {
        this.hostEl = this.cursorEl.parentElement?.parentElement!;
        this.initEvents();
      }
    });
  }

  initEvents() {
    const self = this;

    this.hostEl.addEventListener('mouseleave', () => {
      this.hide();
    });

    this.hostEl.addEventListener('mouseenter', () => {
      this.show();
    });

    this.hostEl.addEventListener('mousemove', (e) => {
      this.#pos = {
        x: this.#stick
          ? this.#stick.x - (this.#stick.x - e.clientX) * 0.15
          : e.clientX,
        y: this.#stick
          ? this.#stick.y - (this.#stick.y - e.clientY) * 0.15
          : e.clientY,
      };
      this.update();
    });

    this.hostEl.addEventListener('mousedown', () => {
      this.setState('-active');
    });

    this.hostEl.addEventListener('mouseup', () => {
      this.removeState('-active');
    });

    this.hostEl.querySelectorAll('a, input, textarea, button').forEach((el) => {
      el.addEventListener('mouseenter', function () {
        self.setState('-pointer');
      });
    });

    this.hostEl.querySelectorAll('a, input, textarea, button').forEach((el) => {
      el.addEventListener('mouseleave', function () {
        self.removeState('-pointer');
      });
    });

    this.hostEl.querySelectorAll('iframe').forEach((el) => {
      el.addEventListener('mouseenter', function () {
        self.hide();
      });
    });

    this.hostEl.querySelectorAll('iframe').forEach((el) => {
      el.addEventListener('mouseleave', function () {
        self.show();
      });
    });

    // cursor
    this.hostEl.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        self.setState(el.getAttribute('data-cursor')!);
      });
    });

    this.hostEl.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseleave', function () {
        self.removeState(el.getAttribute('data-cursor')!);
      });
    });

    // cursor text
    this.hostEl.querySelectorAll('[data-cursor-text]').forEach((el) => {
      el.addEventListener('mouseenter', function () {
        self.setText(el.getAttribute('data-cursor-text')!);
      });
    });

    this.hostEl.querySelectorAll('[data-cursor-text]').forEach((el) => {
      el.addEventListener('mouseleave', function () {
        self.removeText();
      });
    });

    // cursor
    this.hostEl.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', function () {
        self.setState(el.getAttribute('data-cursor')!);
      });
    });

    this.hostEl.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseleave', () => {
        self.removeState(el.getAttribute('data-cursor')!);
      });
    });

    // sticky
    this.hostEl.querySelectorAll('[data-cursor-stick]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        self.setStick(el.getAttribute('data-cursor-stick')!);
      });
    });

    this.hostEl.querySelectorAll('[data-cursor-stick]').forEach((el) => {
      el.addEventListener('mouseleave', function () {
        self.removeStick();
      });
    });
  }

  setState(state: string) {
    const statee = state.split(' ');
    statee.forEach((element) => {
      this.cursorEl.classList.add(element);
    });
  }

  removeState(state: string) {
    const statee = state.split(' ');
    statee.forEach((element) => {
      this.cursorEl.classList.remove(element);
    });
  }

  toggleState(state: string) {
    if (this.cursorEl.classList.contains(state)) {
      this.setState(state);
    } else {
      this.removeState(state);
    }
  }

  setText(text: string) {
    this.cursorTextEl.innerHTML = text;
    this.cursorEl.classList.add('-text');
  }

  removeText() {
    this.cursorEl.classList.remove('-text');
  }

  setStick(selector: string) {
    const target = this.hostEl.querySelector(selector) as HTMLElement;
    const bound = target.getBoundingClientRect();

    this.#stick = {
      y: bound.top + target.offsetHeight / 2,
      x: bound.left + target.offsetWidth / 2,
    };
    this.move(this.#stick.x, this.#stick.y, 10);
  }

  removeStick() {
    this.#stick = false;
  }

  update() {
    this.move();
    this.show();
  }

  // move cursor
  move(x?: number, y?: number, duration?: number) {
    gsap.to(this.cursorEl, {
      x: x || this.#pos.x,
      y: y || this.#pos.y,
      force3D: true,
      overwrite: true,
      ease: this.options.ease,
      duration: this.visible ? duration || this.options.speed : 0,
    });

    //change behavior on mobile devices
    if (this.isTouchDevice() && this.cursorEl.classList.contains('-hidden')) {
      this.cursorEl.classList.remove('-hidden');
    }

    if (this.isTouchDevice()) {
      clearTimeout(this.cursorStoppedTimer);
      this.cursorStoppedTimer = setTimeout(() => {
        this.cursorEl.classList.add('-hidden');
        this.cursorTextEl.classList.add('-hidden');
        // this.cursorTextEl.style.display = 'none';
      }, 1000);
    }
  }

  // show cursor
  show() {
    if (this.visible) return;
    clearInterval(this.#visibleInt);
    this.cursorEl.classList.add('-visible');
    this.#visibleInt = setTimeout(() => (this.visible = true));
  }

  // hide cursor
  hide() {
    clearInterval(this.#visibleInt);
    this.cursorEl.classList.remove('-visible');
    this.#visibleInt = setTimeout(
      () => (this.visible = false),
      this.options.visibleTimeout
    );
  }

  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
}
