import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/common/auth.service';
import { ApiUtilService } from '../services/common/api.util.service';
import * as _ from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root',
})
export class NotLoginGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    private apiutil: ApiUtilService,
    public permissionService: NgxPermissionsService
  ) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Observable<boolean>((observer) => {
      if(!this.authService.isLogin()) {
        this.permissionService.addPermission('TICKET_ADD');
      }
      observer.next(true);
    });
  }
}
