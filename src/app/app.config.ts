import { ApplicationConfig } from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling,
  
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideClientHydration,
} from '@angular/platform-browser';

import { routes } from './app.routes';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [provideClientHydration(), provideRouter(routes, inMemoryScrollingFeature), provideAnimations(), ],
};
