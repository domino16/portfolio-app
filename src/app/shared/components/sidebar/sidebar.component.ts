import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutService } from '../../../core/services/layout.service';
import { MagneticElementToCursorDirective } from '../../directives/cursor/magnetic-element-to-cursor.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, AsyncPipe, MagneticElementToCursorDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly layoutService  = inject(LayoutService)
  isMenuActive$ = this.layoutService.isMenuOpen$;
  

  toggleMenu(){
    this.layoutService.toggleMenu();
  }

}
