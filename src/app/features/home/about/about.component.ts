import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeadingScrollDirective } from '../../../shared/directives/animations/heading-scroll.directive';
import { TextAnimationDirective } from '../../../shared/directives/animations/text-animation.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [HeadingScrollDirective, TextAnimationDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
