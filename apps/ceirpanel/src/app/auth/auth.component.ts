/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from "lodash";
import { UserModel } from '../core/models/user.model';
import { ApiUtilService } from '../core/services/common/api.util.service';
import { AuthService } from '../core/services/common/auth.service';
import { JwtService } from '../core/services/common/jwt.service';
import { MenuTransportService } from '../core/services/common/menu.transport.service';
import { PermissionService } from '../core/services/common/permission.service';
import { ConfigService } from 'ng-config-service';
import { DOCUMENT } from '@angular/common';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ceirpanel-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: false
})
export class AuthComponent {
  user: UserModel = {} as UserModel;
  submit!: boolean;
  isAuthenticated = false;
  siteKey!:string;
  alert!:any;
  isLocalhost = true;
  isOpen = true;
  model!: NgbDateStruct;
  msisdn!:string;
  redirect!:string;

  constructor(
    public menuTransport: MenuTransportService,
    private router: Router, private jwtService: JwtService,
    private transport: MenuTransportService,
    public authService: AuthService, private apiutil: ApiUtilService,
    public config: ConfigService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: any,
    private permissionService: PermissionService) {
      const iframelogin: any = this.jwtService.getIframeLogin();
      if (!_.isEmpty(iframelogin) && !_.isEmpty(iframelogin.token)) {
        this.authService.purgeAuth('logout');
        localStorage.removeItem('permissions');
        this.jwtService.removeIFrameLogin();
      }
    this.apiutil.get('/api/auth/isLogin').subscribe({
      next: (data) => {
        if (_.isEqual(_.get(data, 'login'), true)) {
          setTimeout(() => this.router.navigate(['/dashboard']), 1000);
        }
      }
    });
    this.authService.isAuthenticated.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
    this.apiutil.get('/config/frontend').subscribe({
      next: (data:any) => {
        this.siteKey = data.siteKey;
      }
    });
    console.log('localhost: ', this.document.location.host);
    this.isLocalhost = this.document.location.host.includes('localhost');
    this.route.queryParams.subscribe(queryParams => {
      this.msisdn = queryParams['msisdn'] || '';
      this.redirect = queryParams['redirect'] || '';
    });
  }

  onSubmit() {
    this.alert = null;
    this.submit = true;
    this.transport.progress = true;
    this.apiutil.post('/api/auth/signin', this.user).subscribe({
      next: (data) => {
        this.jwtService.removeIFrameLogin();
        if (_.isEqual(_.get(data, 'apiResult'), 'success')) {
          localStorage.removeItem('permissions');
          const user: UserModel = data as UserModel;
          this.authService.setAuth(user, user.token);
          this.transport.loader = false;
          this.apiutil.get('/api/auth/isLogin').subscribe({
            next: (data) => {
              if (_.isEqual(_.get(data, 'passwordExpire'), true)) {
                this.router.navigate(['/change-password'],{queryParams:{hidesidebar: 'yes'}});
              } else if (_.isEqual(_.get(data, 'temparoryPassword'), true)) {
                this.router.navigate(['/change-password'],{queryParams:{hidesidebar: 'yes'}});
              } else {
                this.apiutil.loadMenu('vivesha').subscribe({
                  next: (menu) => {
                    this.transport.menu = menu;
                    localStorage.setItem('menu', JSON.stringify(menu));
                    this.transport.loader = true;
                    this.permissionService.load().then(() => {
                      if(_.isEmpty(this.msisdn)) {
                        console.log('url to redirect: ', this.navigaterUrl(menu as any[]));
                        setTimeout(() => {
                          this.router.navigate([this.navigaterUrl(menu as any[])]);
                        }, 2000);
                      } else {
                        setTimeout(() => {
                          this.router.navigate(['/check-ticket-status'],{queryParams:{msisdn: this.msisdn,redirect: this.redirect}});
                        }, 2000);
                      }  
                    });
                  },
                });
              }
            }
          });
        } else {
          this.alert = {type: 'danger', message: _.get(data,'message')};
          setTimeout(() => this.alert = null, 10000);
        }
      },
      error: (e) => {
        this.authService.purgeAuth(e);
        return this.router.navigate(['/login'])
      },
      complete: () => {
        this.submit = true;
        setTimeout(() => this.transport.progress = false, 3000);
      }
    });
  }
  public navigaterUrl(menu: any[]) {
    if(_.some(menu,{link: "dashboard"})) {
      return '/dashboard';
    }
    return _.sample(menu as any[]).link;
  }
}
