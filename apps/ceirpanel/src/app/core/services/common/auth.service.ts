/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ConfigService } from 'ng-config-service';
import { BehaviorSubject, Observable, ReplaySubject, distinctUntilChanged } from 'rxjs';
import { UserModel } from '../../models/user.model';
import { ApiUtilService } from './api.util.service';
import { JwtService } from './jwt.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<UserModel>({} as UserModel);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  private _loginKey = 'isAuthenticated';

  constructor(
    private config: ConfigService,
    private apicall: ApiUtilService,
    private jwtService: JwtService
  ) { }
  attemptAuth(credentials: any): Observable<any> {
    return this.apicall.postForHeaders(this.config.get('loginUrl') || '', credentials);
  }
  populate() {
    if (this.jwtService.getToken()) {
      this.apicall.get(this.config.get('validateSessionUrl') + '/' + this.jwtService.getUsername()).subscribe({
        next: (data) => this.setAuth(data as UserModel, this.jwtService.getToken() as string),
        error: (e) => this.purgeAuth(e),
        complete: () => console.info('complete')
      });
    } else {
      this.purgeAuth('token expired');
    }
  }
  public isLogin(){
    return JSON.parse(localStorage.getItem(this._loginKey) || 'false');
  }
  public setAuth(user: UserModel, token: string): UserModel {
    this.jwtService.saveToken(user, token);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem(this._loginKey, 'true');
    return user;
  }
  purgeAuth(error: unknown) {
    this.jwtService.destroyToken();
    this.currentUserSubject.next({} as UserModel);
    this.isAuthenticatedSubject.next(false);
    localStorage.setItem(this._loginKey, 'false');
    return error;
  }
  login(user: UserModel){
    this.apicall.post('auth/login', user).subscribe({
      next: (data) => of(this.setAuth(data as UserModel, this.jwtService.getToken() as string)),
      error: (e) => of(this.purgeAuth(e)),
      complete: () => console.info('complete')
    });
  }
}
