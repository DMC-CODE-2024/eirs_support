import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { bootConfigServiceProvider } from 'ng-config-service';
import { appRoutes } from './app.routes';
import { ApiUtilService } from './core/services/common/api.util.service';

export function appInit(apiutil: ApiUtilService) {
  return () => apiutil.loadMenu('vivesha');
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    bootConfigServiceProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: () => appInit, 
      multi: true,
      deps: [ApiUtilService]
    }
  ],
};
