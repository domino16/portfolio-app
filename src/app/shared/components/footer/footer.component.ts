import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MagneticElementToCursorDirective } from '../../directives/cursor/magnetic-element-to-cursor.directive';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MagneticElementToCursorDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
