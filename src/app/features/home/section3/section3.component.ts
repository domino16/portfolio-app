import { Component } from '@angular/core';
import { HeadingScrollDirective } from '../../../shared/directives/animations/heading-scroll.directive';

@Component({
  selector: 'app-section3',
  standalone: true,
  imports: [HeadingScrollDirective],
  templateUrl: './section3.component.html',
  styleUrl: './section3.component.scss',
})
export class Section3Component{

}