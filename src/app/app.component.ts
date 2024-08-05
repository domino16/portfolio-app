import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { HomeComponent } from './features/home/home.component';
import { AsyncPipe } from '@angular/common';
import { LayoutService } from './core/services/layout.service';
import { BackgroundSmokeComponent } from './features/background-smoke/background-smoke.component';
import { ProjectsComponent } from './features/home/projects/projects.component';
import { overlayAnimationTrigger } from './shared/animations/overlay-animations';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { BehaviorSubject } from 'rxjs';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MagneticCursorComponent } from './ui/organism/magnetic-cursor/magnetic-cursor.component';
import { MagneticCursorDirective } from './shared/directives/cursor/magnetic-cursor.directive';

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
    ProjectsComponent,
    LoaderComponent,
    FooterComponent,
    MagneticCursorComponent,
    MagneticCursorDirective,
    AsyncPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: overlayAnimationTrigger,
})
export class AppComponent implements OnInit {
  private readonly layoutService = inject(LayoutService);
  isMenuOpen$ = this.layoutService.isMenuOpen$;
  isMobile$ = this.layoutService.mobileWidth$
  isPreLoaded = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    setTimeout(() => this.isPreLoaded.next(true), 1500);
  }
}
