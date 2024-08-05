import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MagneticElementToCursorDirective } from '../../../shared/directives/cursor/magnetic-element-to-cursor.directive';

@Component({
  selector: 'app-magnetic-link-button',
  standalone: true,
  imports: [MagneticElementToCursorDirective],
  templateUrl: './magnetic-link-button.component.html',
  styleUrl: './magnetic-link-button.component.scss',
})
export class MagneticLinkButtonComponent {
  buttonWidth: number = 0;

  @Input('btnText') btnText!: string;

  @ViewChild('button') button!: ElementRef<HTMLSpanElement>;

  onMouseEnter() {
    this.button.nativeElement.style.height =
      this.button.nativeElement.offsetWidth + 'px';
  }

  onMouseLeave() {
    this.button.nativeElement.style.height = '58px';
  }
}
