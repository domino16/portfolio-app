import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { MagneticLinkButtonComponent } from '../../../shared/components/magnetic-link-button/magnetic-link-button.component';
import { HeadingScrollDirective } from '../../../shared/directives/animations/heading-scroll.directive';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [
    MagneticLinkButtonComponent,
    HeadingScrollDirective,
    GoogleMap,
    MapMarker,
    NgFor,
  ],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss',
})
export class ContactSectionComponent implements OnInit {
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
    styles: [
      {
        featureType: 'road',
        // elementType: 'labels',
        stylers: [{ color: '#121315' }],
      },
      {
        featureType: 'road',
        // elementType: 'labels',
        stylers: [{ visibility: 'simplified' }],
      },
      {
        featureType: 'landscape',
        stylers: [{ color: '#00dede' }],
      },

      {
        featureType: 'water',
        stylers: [{ color: '#121315' }],
      },
      {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [{ visibility: 'off' }],
      },

      //       $primary-color: #c5fcfc;
      // $secondary-color: #121315;
      // $dark-background-color: #bd2929;
      // $dark-accent-color: #242c31;
      // $pure-white: #e0eeee;

      // $placeholder-color: #545454;
      // {
      //   featureType: 'poi.business',
      //   elementType: 'labels.icon',
      //   stylers: [{ visibility: 'off' }],
      // },
    ],
  };

  ngOnInit(): void {
    this.markers.push({
      position: this.lodzCords,
      label: { color: 'black', text: 'Me' },
      title: 'Me',
    });
  }
}
