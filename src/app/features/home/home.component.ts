import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { Section2Component } from './section2/section2.component';
import { Section3Component } from './section3/section3.component';
import { ProjectsComponent } from '../projects/projects.component';
import { AboutComponent } from './about/about.component';
import { ContactSectionComponent } from './contact-section/contact-section.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Section2Component, Section3Component, ProjectsComponent, ContactSectionComponent, AboutComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
}
