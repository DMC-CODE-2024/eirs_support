/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtService } from '../services/common/jwt.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) {}
  multipart = false;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { body } = req;
    //console.log('body: ', body);
    const headersConfig = {} as any;
    if (body instanceof FormData && typeof body  !== 'undefined') {
        //headersConfig['Content-Type'] =  `multipart/form-data;boundary=${Math.random()}`
        this.multipart = true;
        //console.log('multipart: ', this.multipart);
    }
    if (!this.multipart) {
      headersConfig['Content-Type'] =  'application/json';
      // tslint:disable-next-line: no-string-literal
      headersConfig['Accept'] =  'application/json';
    }
    const token = this.jwtService.getToken();
    // tslint:disable-next-line: no-string-literal
    headersConfig['Authorization'] = `Bearer ${token}`;
    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request);

  }
}
