import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './http.token.interceptor';
import { LoaderInterceptor } from './loader.interceptor';
import { RequestTimeoutHttpInterceptor } from './request-time.interceptor';

export const interceptorProviders =
[
 { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
 { provide: HTTP_INTERCEPTORS, useClass: RequestTimeoutHttpInterceptor, multi: true },
 { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
];