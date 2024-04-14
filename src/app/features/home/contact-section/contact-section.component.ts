import {
  AfterViewInit,
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { MagneticLinkButtonComponent } from '../../../shared/components/magnetic-link-button/magnetic-link-button.component';
import { HeadingScrollDirective } from '../../../shared/directives/animations/heading-scroll.directive';
import {
  GoogleMap,
  GoogleMapsModule,
  MapAdvancedMarker,
  MapMarker,
} from '@angular/google-maps';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [
    MagneticLinkButtonComponent,
    HeadingScrollDirective,
    GoogleMap,
    GoogleMapsModule,
    MapMarker,
    NgFor,
  ],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss',
})
export class ContactSectionComponent implements OnInit, AfterViewInit {
  private readonly renderer = inject(Renderer2);
  @ViewChild(GoogleMap) map!: GoogleMap;

  markers: {
    position: MapMarker['position'];
    label?: MapMarker['label'];
    title?: MapMarker['title'];
    options?: MapMarker['options'];
  }[] = [];

  lodzCords = { lat: 51.759, lng: 19.457 };

  mapOptions: google.maps.MapOptions = {
    zoomControl: false,
    maxZoom: 6,
    minZoom: 3,
    zoom: 5,
    disableDefaultUI: true,
    mapId: '89652c3b71a12c15',
    tilt: 42,
    heading: 10,
  };

  ngOnInit(): void {
    this.markers.push({
      position: this.lodzCords,
      label: { color: 'black', text: 'Me' },
      title: 'Me',
    });
  }

  async ngAfterViewInit(): Promise<void> {
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary;

    const parser = new DOMParser();
    const pinSvgString =
      '<svg id="Layer_1" data-name="Layer 1" width="56" height="56" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98.86 122.88"><defs><style>.cls-1{fill:#b30000;}.cls-2{fill:#07e4e4;fill-rule:evenodd;}.cls-3{fill:#2f3237;}</style></defs><title>i-am-here</title><path class="cls-1" d="M71.81,106.27a89,89,0,0,1-19.42,16.06,2.77,2.77,0,0,1-3.13.12,110.06,110.06,0,0,1-27-24.1c-9.83-12.33-16-26-18.15-39.19C2,45.8,4,33,10.63,22.48A45,45,0,0,1,20.7,11.34C30.07,3.88,40.8-.07,51.46,0,61.74.09,71.88,3.9,80.68,11.93a42.39,42.39,0,0,1,7.78,9.48c7.15,11.77,8.69,26.81,5.56,42a92.41,92.41,0,0,1-22.18,42.8l0,0ZM63.65,32.49a20.07,20.07,0,1,0,5.91,14.22,20.11,20.11,0,0,0-5.91-14.22Z"/><path class="cls-2" d="M.43,75.63h98a45.45,45.45,0,0,1-3.84,25.63H4.26A45.36,45.36,0,0,1,.43,75.63Z"/><path class="cls-3" d="M9,94.21V82.68h3.69V94.21Zm11.6,0H16.74l3-11.53h5.7l3,11.53H24.53l-.43-1.83h-3l-.43,1.83Zm1.85-8.42-1.19,4.09h2.56l-1.17-4.09Zm10.31,8.42H28.93l.71-11.53h4.81l1.44,5.86H36l1.44-5.86h4.81L43,94.21H39.12l-.22-5.59h-.13l-1.4,5.59H34.54l-1.42-5.59H33l-.22,5.59Zm21.35,0V90.13H51.37v4.08H47.68V82.68h3.69v4.08h2.77V82.68h3.68V94.21Zm13.19-4.36H63.64v1.84h4.52v2.52H60V82.68h8.11L67.6,85.2h-4v2h3.69v2.67Zm12.73,4.36H76l-1.52-3.43h-.79v3.43H70V82.68h5.81q4,0,4,4c0,1.84-.57,3.06-1.72,3.65l2,3.84Zm-6.37-9v3.17h.85a2.54,2.54,0,0,0,1-.14c.2-.09.3-.31.3-.64V86q0-.5-.3-.63a2.54,2.54,0,0,0-1-.14ZM89,89.85H85.31v1.84h4.52v2.52H81.62V82.68h8.12l-.46,2.52h-4v2H89v2.67Z"/></svg>';

    const pinSvg = parser.parseFromString(
      pinSvgString,
      'image/svg+xml'
    ).documentElement;

    const marker = new AdvancedMarkerElement({
      map: this.map.googleMap,
      position: this.lodzCords,
      content: pinSvg,
      title: 'A marker using a custom SVG',
    });

    const interval = setInterval(() => {
      const list = document.querySelectorAll<HTMLElement>('.gmnoprint');
      if (list.length > 0) {
        list.forEach((item) => {
          item.style.visibility = 'hidden';
        });
        clearInterval(interval);
      }
    }, 200);
  }
}
