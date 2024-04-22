import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProjectsComponent } from './features/home/projects/projects.component';
import { AboutComponent } from './features/home/about/about.component';
import { ContactSectionComponent } from './features/home/contact-section/contact-section.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'work', component: ProjectsComponent },
  { path: 'contact', component: ContactSectionComponent },
];
