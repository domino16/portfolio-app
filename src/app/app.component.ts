import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { HomeComponent } from './features/home/home.component';
import { AsyncPipe } from '@angular/common';
import { LayoutService } from './core/services/layout.service';
import { BackgroundSmokeComponent } from './features/background-smoke/background-smoke.component';
import { MagneticCursorDirective } from './shared/directives/magnetic-cursor.directive';
import gsap from 'gsap';
import { ProjectsComponent } from './features/projects/projects.component';
export class CursorOptions {
  speed?: number;
  ease?: string;
  visibleTimeout?: number;
  scroller?: {
    selector: string;
    scrollType: 'normal' | 'transform';
  };
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    MenuComponent,
    HomeComponent,
    AsyncPipe,
    BackgroundSmokeComponent,
    MagneticCursorDirective,
    ProjectsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent{
  private readonly layoutService = inject(LayoutService);
  isMenuOpen$ = this.layoutService.isMenuOpen$;

 
}
