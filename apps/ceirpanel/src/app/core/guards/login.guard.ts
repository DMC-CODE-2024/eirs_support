import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import * as _ from 'lodash';
import { ConfigService } from 'ng-config-service';
import { Observable } from 'rxjs';
import { ApiUtilService } from '../services/common/api.util.service';
import { AuthService } from '../services/common/auth.service';
import { JwtService } from '../services/common/jwt.service';
import { MenuTransportService } from '../services/common/menu.transport.service';
import { PermissionService } from '../services/common/permission.service';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard {
  private counter = 1;
  token!: string;
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private permission: PermissionService,
    private jwtService: JwtService,
    private router: Router,
    private apiutil: ApiUtilService,
    private menuTransport: MenuTransportService,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}
  canActivate():
      | Observable<boolean | UrlTree>
      | Promise<boolean | UrlTree>
      | boolean
      | UrlTree {
      return new Observable<boolean>(observer => {
        setTimeout(() => {
          this.apiutil.get('/api/auth/isLogin').subscribe({
            next: (data) => {
              if (_.isEqual(_.get(data, 'login'), false)) {
                this.authService.purgeAuth('logout');
                this.router.navigate(['/']);
                observer.next(true);
              } else {
                if (_.isEqual(_.get(data, 'passwordExpire'), true)) {
                  this.router.navigate(['/change-password'],{queryParams:{hidesidebar: 'yes'}});
                }else if (_.isEqual(_.get(data, 'temparoryPassword'), true)) {
                  this.router.navigate(['/change-password'],{queryParams:{hidesidebar: 'yes'}});
                }
                observer.next(true);
              }
            }
          });
        }, 1000);
      });
  }
}
