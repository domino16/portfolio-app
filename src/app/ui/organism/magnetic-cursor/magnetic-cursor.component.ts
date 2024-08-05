import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MagneticCursorDirective } from '../../../shared/directives/cursor/magnetic-cursor.directive';

@Component({
  selector: 'app-magnetic-cursor',
  standalone: true,
  imports: [MagneticCursorDirective],
  templateUrl: './magnetic-cursor.component.html',
  styleUrl: './magnetic-cursor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MagneticCursorComponent {

}
