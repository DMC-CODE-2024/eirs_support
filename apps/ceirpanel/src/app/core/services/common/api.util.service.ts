/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ConfigService } from 'ng-config-service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuTransportService } from './menu.transport.service';

@Injectable({
    providedIn: 'root',
    deps: [ConfigService]
})
export class ApiUtilService {
    private uri!: string;
    
    constructor(
        private http: HttpClient, private configService: ConfigService, 
        private menuTransport: MenuTransportService,
        @Inject(DOCUMENT) private document: any) {
           
        this.uri = this.configService.get('api') ? this.configService.get('api'): this.document.location.host;
        //console.log('host: ', this.document.location);
        //console.log('configuration: ', this.configService);
    }

    loadMenu(type: string) : Observable<unknown>{
        this.menuTransport.type = type; 
        return this.get('/feature/menu');
    }
    get(path: string, params: HttpParams = new HttpParams()): Observable<unknown> {
        return this.http.get(`${this.configService.get('api')}${path}`, { params });
    }

    getText(url: string): Observable<unknown> {
        return this.http.get(url, { observe: 'body', responseType: 'text' });
    }
 
    getLocal(url: string): Observable<unknown> {
        return this.http.get(url);
    }

    put(path: string, body: unknown = {}): Observable<unknown> {
        return this.http.put(
            `${this.configService.get('api')}${path}`,
            body
        ).pipe(catchError(this.formatErrors));
    }

    putMultipart(path: string, body: unknown = {}): Observable<unknown> {
        return this.http.put(
            `${this.configService.get('api')}${path}`,
            body
        ).pipe(catchError(this.formatErrors));
    }

    postMultipart(path: string, body: unknown = {}): Observable<unknown> {
        return this.http.post(
            `${this.configService.get('api')}${path}`,
            body
        ).pipe(catchError(this.formatErrors));
    }

    post(path: string, body: unknown = {}): Observable<unknown> {
        //console.log('post: {}', body);
        //console.log('api: ', this.uri);
        return this.http.post(
            `${this.configService.get('api')}${path}`,
            body
        ).pipe(catchError(this.formatErrors));
    }

    postFormData(path: string, formData: FormData): Observable<unknown> {
        return this.http.post(
            `${this.configService.get('api')}${path}`, formData
        ).pipe(catchError(this.formatErrors));
    }

    delete(path: string): Observable<unknown> {
        return this.http.delete(
            `${this.configService.get('api')}${path}`
        ).pipe(catchError(this.formatErrors));
    }

    postForHeaders(path: string, body: unknown = {}): Observable<unknown> {
        return this.http.post(`${this.configService.get('api_url')}${path}`, JSON.stringify(body), { observe: 'response' });
    }
    
    private formatErrors(error: unknown) {
        return throwError(error);
    }
}