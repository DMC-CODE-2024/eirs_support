/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { UploadService } from './upload.service';
import * as _ from 'lodash'; 

@Injectable({
    providedIn: 'root'
})
export class MenuTransportService {
    constructor(public uploadService: UploadService) { }

    private SUBMENU: BehaviorSubject<[]> = new BehaviorSubject<[]>({} as []);
    public _submenu = this.SUBMENU.asObservable().pipe(distinctUntilChanged());

    private BREADCRUMB: BehaviorSubject<[]> = new BehaviorSubject<[]>({} as []);
    public _breadcrumb = this.BREADCRUMB.asObservable().pipe(distinctUntilChanged());

    private MENU: BehaviorSubject<unknown> = new BehaviorSubject<unknown>(Array<any>);
    public readonly _menu = this.MENU.asObservable().pipe(distinctUntilChanged());

    private PROGRESS: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false as boolean);
    public _progress = this.PROGRESS.asObservable().pipe(distinctUntilChanged());

    private LOADER: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false as boolean);
    public _loader = this.LOADER.asObservable().pipe(distinctUntilChanged());

    private ALERT: BehaviorSubject<unknown> = new BehaviorSubject<unknown>({} as unknown);
    public _alert = this.ALERT.asObservable().pipe(distinctUntilChanged());

    private _collapse = false;
    private _type: unknown;

    set alert(alert: unknown) {
        this.ALERT.next(alert);
    }

    set loader(enable: boolean) {
        this.LOADER.next(enable);
    }
    set progress(progress: boolean) {
        this.PROGRESS.next(progress);
    }

    set menu(menu: any) {
        menu.forEach((m: { icon: string }) => {
            if (m.icon.includes('feature')) {
                m = Object.assign(m, { url: this.uploadService.resource(m.icon) });
            }
        });
        this.MENU.next(menu);
    }

    set submenu(submenu: []) {
        this.SUBMENU.next(submenu);
    }

    set breadcrumb(breadcrumb: []) {
        this.BREADCRUMB.next(breadcrumb);
    }

    set collapse(value: boolean) {
        this._collapse = value;
    }

    get collapse() {
        return this._collapse;
    }

    set type(type) {
        this._type = type;
    }
    get type() {
        return this._type;
    }
}