import { Component } from '@angular/core';
import { HeadingScrollDirective } from '../../../shared/directives/animations/heading-scroll.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [HeadingScrollDirective],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent{

}