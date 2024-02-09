import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private isMenuOpenSubject$ = new BehaviorSubject<boolean>(false);
  isMenuOpen$ = this.isMenuOpenSubject$.asObservable();

  toggleMenu() {
    this.isMenuOpenSubject$.value === false
      ? this.isMenuOpenSubject$.next(true)
      : this.isMenuOpenSubject$.next(false);
  }
}
