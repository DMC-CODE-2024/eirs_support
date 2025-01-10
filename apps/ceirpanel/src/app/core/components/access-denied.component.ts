/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { JwtService } from '../services/common/jwt.service';
import { ApiUtilService } from '../services/common/api.util.service';
import { AuthService } from '../services/common/auth.service';
import { UserModel } from '../models/user.model';
import { PermissionService } from '../services/common/permission.service';
import { MenuTransportService } from '../services/common/menu.transport.service';

@Component({
  selector: 'ceirpanel-access-denied',
  template: `
    <div
      class="app flex-row align-items-center"
      *ngIf="!iframelogin && !iframelogin.token"
    >
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="clearfix">
              <h1 class="float-left display-3 mr-4">403</h1>
              <h4 class="pt-3">Oops! You do not have access.</h4>
              <p class="text-muted">The page you are looking for was denied.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``],
})
export class AccessDeniedComponent implements OnInit {
  iframelogin: any;
  constructor(
    private router: Router,
    private jwtService: JwtService,
    private apiutil: ApiUtilService,
    private authService: AuthService,
    private permissionService: PermissionService,
    public menuTransport: MenuTransportService
  ) {}
  ngOnInit(): void {
    this.iframelogin = this.jwtService.getIframeLogin();
    if (!_.isEmpty(this.iframelogin) && !_.isEmpty(this.iframelogin.token)) {
      this.apiutil.get('/api/auth/isLogin').subscribe({
        next: (data: any) => {
          data.token = this.iframelogin.token;
          this.authService.setAuth(data as UserModel, this.iframelogin.token);
          this.permissionService.load().then(() => {
            this.router.navigate([this.iframelogin.uri], {
              queryParams: {
                lang: this.iframelogin.lang,
                header: this.iframelogin.header,
                type: this.iframelogin.type,
                hidesidebar: this.iframelogin.hidesidebar,
              },
            });
          });
        }
      });
    }
  }
}
