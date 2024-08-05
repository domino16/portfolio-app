import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IntroComponent } from './intro/intro.component';
import { SkillsComponent } from './skills/skills.component';
import { ProjectsComponent } from './projects/projects.component';
import { AboutComponent } from './about/about.component';
import { ContactSectionComponent } from './contact-section/contact-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IntroComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactSectionComponent,
    AboutComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
