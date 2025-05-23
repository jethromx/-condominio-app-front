import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import  {  provideAnimations  }  from  '@angular/platform-browser/animations' ;
import  {  provideToastr  }  from  'ngx-toastr' ;
import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { loggingInterceptor } from '@shared/interceptors/logging.interceptor';
import { authInterceptor } from '@auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations ( ) ,  // proveedores de animaciones requeridas 
    provideToastr ( ) ,  // proveedores de Toastr 
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loggingInterceptor,
        authInterceptor,
      ])
    ),
  ],
};
