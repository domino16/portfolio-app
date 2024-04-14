import {
  AfterViewChecked,
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
import { MagneticCursorDirective } from './shared/directives/cursor/magnetic-cursor.directive';
import gsap from 'gsap';
import { ProjectsComponent } from './features/home/projects/projects.component';
import { overlayAnimationTrigger } from './shared/animations/overlay-animations';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { BehaviorSubject } from 'rxjs';
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
    ProjectsComponent,
    LoaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: overlayAnimationTrigger,
})
export class AppComponent implements OnInit {
  private readonly layoutService = inject(LayoutService);
  isMenuOpen$ = this.layoutService.isMenuOpen$;

  isPreLoaded = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    setTimeout(() => this.isPreLoaded.next(true), 1500);
  }
}
