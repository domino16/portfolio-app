import { HostListener, Injectable, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, fromEvent, map, Observable, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private isMenuOpenSubject$ = new BehaviorSubject<boolean>(false);
  isMenuOpen$ = this.isMenuOpenSubject$.asObservable();

  private mobileWidth = 768;
  private resizeSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.isMobileWidth(window.innerWidth));

  mobileWidth$: Observable<boolean> = this.resizeSubject.asObservable();

  constructor() {
    this.addResizeListener();
  }

  private addResizeListener() {
    fromEvent(window, 'resize')
      .pipe(
        map((event: Event) =>
          this.isMobileWidth((event.target as Window).innerWidth)
        ),
        startWith(this.isMobileWidth(window.innerWidth))
      )
      .subscribe((isMobile) => this.resizeSubject.next(isMobile));
  }

  private isMobileWidth(width: number): boolean {
    return width <= this.mobileWidth;
  }

  public toggleMenu() {
    this.isMenuOpenSubject$.value === false
      ? this.isMenuOpenSubject$.next(true)
      : this.isMenuOpenSubject$.next(false);
  }
}
