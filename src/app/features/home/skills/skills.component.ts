import { Component } from '@angular/core';
import { HeadingScrollDirective } from '../../../shared/directives/animations/heading-scroll.directive';
import { SubheadingAnimationsDirective } from '../../../shared/directives/animations/subheading-animations.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [HeadingScrollDirective, SubheadingAnimationsDirective],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent{

}