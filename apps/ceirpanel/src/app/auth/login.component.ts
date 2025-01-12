/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { UserModel } from '../core/models/user.model';
import { ApiUtilService } from '../core/services/common/api.util.service';
import { AuthService } from '../core/services/common/auth.service';
import { JwtService } from '../core/services/common/jwt.service';
import { MenuTransportService } from '../core/services/common/menu.transport.service';
import { PermissionService } from '../core/services/common/permission.service';

@Component({
  selector: 'ceirpanel-auth',
  template: `
    <div class="clr-row m-0 p-0">
      <div class="clr-col-6">
        <div class="img-holder">
          <div class="bg"></div>
          <div class="info-holder">
            <img src="assets/images/logo.png" alt="" />
          </div>
        </div>
      </div>
      <div class="clr-col-6">
        <div class="clr-row clr-justify-content-center">
          <div class="clr-col-8">
            <div class="card bg-secondary-subtle shadow-none">
              <div
                class="card-header bg-secondary-subtle border border-0"
              ></div>
              <div class="card-block">
              <form
                clrForm
                clrLayout="vertical"
                class="m-0 p-0"
                #f="ngForm"
                (ngSubmit)="(f.form.valid)"
              >
                  <div class="clr-row clr-justify-content-center">
                    <div class="clr-col-10">
                      <div class="form-group">
                        <label
                          for="username"
                          class="form-label clr-required-mark fw-semibold"
                          >{{ "login.username.label" | translate }}</label
                        >
                        <input
                          type="text"
                          name="userName"
                          class="form-control form-control-sm"
                          id="userName"
                          #userName="ngModel" [ngClass]="{ 'is-invalid': f.submitted && userName.errors }"
                          [(ngModel)]="user.userName" required
                        />
                        <div *ngIf="f.submitted && userName.errors" class="invalid-feedback">
                          <div *ngIf="userName.errors['required']">{{'login.username.error.required' | translate}}</div>
                        </div>
                      </div>
                    </div>
                    <div class="clr-col-10 mt-3">
                      <div class="form-group">
                        <label
                          for="password"
                          class="form-label clr-required-mark fw-semibold"
                          >{{ "login.password.label" | translate }}</label
                        >
                        <input
                          type="text"
                          name="password"
                          class="form-control form-control-sm"
                          id="password"
                          #password="ngModel" [ngClass]="{ 'is-invalid': f.submitted && password.errors }"
                          [(ngModel)]="user.password" required
                        />
                        <div *ngIf="f.submitted && password.errors" class="invalid-feedback">
                          <div *ngIf="password.errors['required']">{{'login.password.error.required' | translate}}</div>
                        </div>
                      </div>
                    </div>
                    <div class="clr-col-10 mt-4">
                      <div
                        class="form-group"
                        style="transform:scale(1.1);transform-origin:0;"
                      >
                        <re-captcha
                          siteKey="6LeLYSwmAAAAAFPrU8jvMZc1ziENdczQw9tZ4QYZ"
                        ></re-captcha>
                      </div>
                    </div>
                    <div class="clr-col-7 mt-4">
                      <button
                        type="submit"
                        class="btn btn-primary btn-block border border-0 text-uppercase ceirloginbutton"
                      >
                        Login
                      </button>
                    </div>
                    <div
                      class="clr-col-9 mt-4 border-bottom border-dark-subtle"
                    ></div>
                    <div class="clr-col-10 mt-2"></div>
                    <div class="clr-col-10">
                        <div class="clr-row clr-justify-content-between ceirloginfooter">
                            <div class="clr-col-6">
                                <button class="btn btn-link " aria-label="Check">
                                    {{ 'button.newUser' | translate }}?
                                </button>
                            </div>
                            <div class="clr-col-6 float-right">
                                <button class="btn btn-link text-right" aria-label="home">
                                    {{ 'button.forgotPassword' | translate }}?
                                </button>
                            </div>
                        </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .btn-lg {
        --bs-btn-padding-y: 0.5rem;
        --bs-btn-padding-x: 1rem;
        --bs-btn-font-size: 1.25rem;
        --bs-btn-border-radius: var(--bs-border-radius-lg);
      }
      .img-holder {
        width: 47%;
        background-color: #fafafa;
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        min-height: 700px;
        height: 100%;
        overflow: hidden;
        padding: 60px;
        text-align: center;
        z-index: 999;
      }

      .img-holder .bg {
        position: absolute;
        opacity: 1;
        background-image: none;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #1e4076;
        background-size: cover;
        background-position: center;
        z-index: -1;
      }

      .img-holder .info-holder {
        position: relative;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
      }

      .img-holder .info-holder img {
        width: 100%;
        max-width: 250px;
      }
    `,
  ],
  standalone: false,
})
export class LoginComponent {
  user: UserModel = {} as UserModel;
  submit!: boolean;
  isAuthenticated = false;
  constructor(
    public menuTransport: MenuTransportService,
    private router: Router,
    private jwtService: JwtService,
    private transport: MenuTransportService,
    private authService: AuthService,
    private apiutil: ApiUtilService,
    private permissionService: PermissionService
  ) {
    this.authService.isAuthenticated.subscribe(
      (isAuthenticated) => (this.isAuthenticated = isAuthenticated)
    );
  }

  onSubmit() {
    this.submit = true;
    this.transport.progress = true;
    this.apiutil.post('/api/auth/signin', this.user).subscribe({
      next: (data) => {
        if (_.isEqual(_.get(data, 'apiResult'), 'success')) {
          localStorage.removeItem('permissions');
          const user: UserModel = data as UserModel;
          this.authService.setAuth(user, user.token);
          this.transport.loader = false;
          this.permissionService.load();
          this.apiutil.loadMenu('vivesha').subscribe({
            next: (menu) => {
              this.router.navigate([_.sample(menu as any[]).link]);
              this.transport.menu = menu;
              localStorage.setItem('menu', JSON.stringify(menu));
              this.transport.loader = true;
            },
          });
        } else {
          this.menuTransport.alert = {
            type: 'danger',
            message: _.get(data, 'message'),
          };
        }
      },
      error: (e) => {
        this.authService.purgeAuth(e);
        return this.router.navigate(['/login']);
      },
      complete: () => {
        this.submit = true;
        setTimeout(() => (this.transport.progress = false), 3000);
      },
    });
  }
}
