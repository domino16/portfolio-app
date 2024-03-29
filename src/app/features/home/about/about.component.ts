import { Component } from '@angular/core';
import { HeadingScrollDirective } from '../../../shared/directives/animations/heading-scroll.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [HeadingScrollDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
