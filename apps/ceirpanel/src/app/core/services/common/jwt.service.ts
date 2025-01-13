/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ConfigService } from 'ng-config-service';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private wmap: Map<string, string> = new Map<string, string>();
  private LOGIN: BehaviorSubject<unknown> = new BehaviorSubject<unknown>({} as unknown);
  public login = this.LOGIN.asObservable().pipe(distinctUntilChanged());

  constructor(private config: ConfigService) { this.LOGIN.next(false); }

  updateWmap(wname: string) {
    this.wmap.set(window.name, wname);
  }
  getWindow() {
    return this.wmap.has(window.name) ? this.wmap.get(window.name) : window.name;
  }
  getToken() {
    return localStorage.getItem(`${this.getWindow()}jwtToken`);
  }
  setToken(token: string) {
    localStorage.setItem(`${this.getWindow()}jwtToken`, token);
  }

  setIframeLogin(obj: any) {
    localStorage.setItem(`${this.getWindow()}iframelogin`, JSON.stringify(obj));
  }

  getIframeLogin() {
    return JSON.parse(localStorage.getItem(`${this.getWindow()}iframelogin`) || '{"inIframe": false}');
  }
  removeIFrameLogin(){
    localStorage.removeItem(`${this.getWindow()}iframelogin`);
  }

  updateLoginStatus(status: boolean) {
    this.LOGIN.next(status);
  }

  getUsername() {
    return localStorage.getItem(`${this.getWindow()}username`);
  }

  getCompanyname() {
    return localStorage.getItem(`${this.getWindow()}companyname`);
  }

  getProfileType() {
    return localStorage.getItem(`${this.getWindow()}profileType`);
  }

  getUserId(){
    return localStorage.getItem(`${this.getWindow()}userId`);
  }

  getLastURL() {
    return decodeURIComponent(localStorage.getItem(`${this.getWindow()}lasturl`) || '{}');
  }

  setLastURL(lasturl: string) {
    localStorage.setItem(`${this.getWindow()}lasturl`,encodeURIComponent(lasturl) );
  }

  setProfileType(profileType: string) {
    localStorage.setItem(`${this.getWindow()}profileType`, profileType);
  }

  saveToken(user: UserModel, token: string) {
    localStorage.setItem(`${this.getWindow()}userId`,user.id+"");
    localStorage.setItem(`${this.getWindow()}jwtToken`, token);
    localStorage.setItem(`${this.getWindow()}username`, user.userName);
    localStorage.setItem(`${this.getWindow()}session`, JSON.stringify(user));
    this.LOGIN.next(true);
  }

  destroyToken() {
    localStorage.removeItem(`${this.getWindow()}jwtToken`);
    localStorage.removeItem(`${this.getWindow()}username`);
    localStorage.removeItem(`${this.getWindow()}userId`);
    this.removeIFrameLogin();
    this.LOGIN.next(false);
  }

}
