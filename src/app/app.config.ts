import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@ngneat/transloco';
import { environment } from '../environments/environment';
import { errorInterceptor } from './_interceptors/error.interceptor';
import { loggerInterceptor } from './_interceptors/logger.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withComponentInputBinding()), provideClientHydration(), 
    provideHttpClient(
      withInterceptors([
        errorInterceptor,
        loggerInterceptor

    ])), 
    provideTransloco({
        config: { 
          availableLangs: ['en-us', 'pt-br'],
          defaultLang: environment.defaultLanguage,
          // Remove this option if your application doesn't support changing language in runtime.
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      })]
};