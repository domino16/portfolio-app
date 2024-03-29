import { Component } from '@angular/core';
import { MagneticElementToCursorDirective } from '../../shared/directives/cursor/magnetic-element-to-cursor.directive';
import { MagneticLinkButtonComponent } from '../../shared/components/magnetic-link-button/magnetic-link-button.component';
import { MagneticOptions } from '../../core/services/interfaces/magneticOptions';
import { HeadingScrollDirective } from '../../shared/directives/animations/heading-scroll.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    MagneticElementToCursorDirective,
    MagneticLinkButtonComponent,
    HeadingScrollDirective,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  projectImgOptions: MagneticOptions = {
    hDelta: 0.07,
    vDelta: 0.07,
  };
}
