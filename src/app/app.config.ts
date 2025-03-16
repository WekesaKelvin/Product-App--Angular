import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store'; 
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { productReducer, productFeatureKey } from './pages/store/product.reducer';
import { ProductEffects } from './pages/store/product.effects';
import { GlobalErrorHandler } from './core/global-error-handler';
import { HttpErrorInterceptor } from './core/http-error.interceptor';
import { ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({ product: productReducer }),
    provideState(productFeatureKey, productReducer), 
    provideEffects([ProductEffects]), 
    provideStoreDevtools({ maxAge: 25 }) ,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ]
};