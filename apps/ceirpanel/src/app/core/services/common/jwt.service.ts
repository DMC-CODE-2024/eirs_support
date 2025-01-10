/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ConfigService } from 'ng-config-service';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';

const _token = "ceirpanel-";
@Injectable({
  providedIn: 'root'
})
export class JwtService {
  
  private LOGIN: BehaviorSubject<unknown> = new BehaviorSubject<unknown>({} as unknown);
  public login = this.LOGIN.asObservable().pipe(distinctUntilChanged());

  constructor(private config: ConfigService) { this.LOGIN.next(false); }
  
  getToken() {
    return localStorage.getItem(`${_token}jwtToken`);
  }
  setToken(token: string) {
    localStorage.setItem(`${_token}jwtToken`, token);
  }

  setIframeLogin(obj: any) {
    localStorage.setItem('iframelogin', JSON.stringify(obj));
  }

  getIframeLogin() {
    return JSON.parse(localStorage.getItem('iframelogin') || '{"inIframe": false}');
  }
  removeIFrameLogin(){
    localStorage.removeItem('iframelogin');
  }

  updateLoginStatus(status: boolean) {
    this.LOGIN.next(status);
  }

  getUsername() {
    return localStorage.getItem(`${_token}username`);
  }

  getCompanyname() {
    return localStorage.getItem(`${_token}companyname`);
  }

  getProfileType() {
    return localStorage.getItem(`${_token}profileType`);
  }

  getUserId(){
    return localStorage.getItem(`${_token}userId`);
  }

  getLastURL() {
    return decodeURIComponent(localStorage.getItem(`lasturl`) || '{}');
  }

  setLastURL(lasturl: string) {
    localStorage.setItem(`lasturl`,encodeURIComponent(lasturl) );
  }

  setProfileType(profileType: string) {
    localStorage.setItem(`${_token}profileType`, profileType);
  }

  saveToken(user: UserModel, token: string) {
    console.log('user: ', user);
    localStorage.setItem(`${_token}userId`,user.id+"");
    localStorage.setItem(`${_token}jwtToken`, token);
    localStorage.setItem(`${_token}username`, user.userName);
    localStorage.setItem(`${_token}session`, JSON.stringify(user));
    this.LOGIN.next(true);
  }

  destroyToken() {
    console.log('remove token');
    localStorage.removeItem(`${_token}jwtToken`);
    localStorage.removeItem(`${_token}username`);
    localStorage.removeItem(`${_token}userId`);
    this.removeIFrameLogin();
    this.LOGIN.next(false);
  }

}
