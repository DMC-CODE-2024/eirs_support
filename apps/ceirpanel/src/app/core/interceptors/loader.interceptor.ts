import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MenuTransportService } from '../services/common/menu.transport.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

    constructor(private transport: MenuTransportService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const {method, url} = request; 
        if(method==='GET' && (url.includes('feature/menu') || url.includes('user/permissions') || url.includes('api/auth/isLogin'))){
            this.transport.progress = false;
        } else {
            this.transport.progress = true;
        }
        return next.handle(request).pipe(
            finalize(() => setTimeout(() => this.transport.progress = false,2000)),
        );
    }
}