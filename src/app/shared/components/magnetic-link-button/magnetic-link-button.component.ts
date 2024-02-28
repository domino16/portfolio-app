import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MagneticElementToCursorDirective } from '../../directives/magnetic-element-to-cursor.directive';

@Component({
  selector: 'app-magnetic-link-button',
  standalone: true,
  imports: [MagneticElementToCursorDirective],
  templateUrl: './magnetic-link-button.component.html',
  styleUrl: './magnetic-link-button.component.scss',
})
export class MagneticLinkButtonComponent implements AfterViewInit {
  buttonWidth: number = 0;

  @ViewChild('button') button!: ElementRef<HTMLSpanElement>;

  ngAfterViewInit(): void {}

  onMouseEnter() {
    this.button.nativeElement.style.height =
      this.button.nativeElement.offsetWidth + 'px';
  }

  onMouseLeave() {
    this.button.nativeElement.style.height = '50px';
  }
}
