import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  private readonly layoutService = inject(LayoutService);
  loadedTime = new Date().getTime();

  scrollTo(selector: string): void {
    const scroll = () => {
      const el = document.querySelector(selector);
      el?.scrollIntoView();
      window.scrollBy(0, window.innerWidth > 1024 ? 0 : -70);
      this.layoutService.toggleMenu();
    };

    //let to finish the animation
    const clickedTime = new Date().getTime();
    const remainingTime = 2000 - (clickedTime - this.loadedTime);
    if (remainingTime <= 0) {
      scroll();
    } else {
      setTimeout(scroll, remainingTime);
    }
  }
}
