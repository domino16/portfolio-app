import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeadingScrollDirective } from '../../../shared/directives/animations/heading-scroll.directive';
import { TextAnimationDirective } from '../../../shared/directives/animations/text-animation.directive';
import { ScrollImageDirective } from '../../../shared/directives/animations/scroll-image.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [HeadingScrollDirective, TextAnimationDirective, ScrollImageDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
