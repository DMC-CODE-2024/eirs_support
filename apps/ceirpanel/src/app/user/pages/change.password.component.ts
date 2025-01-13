/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { ChangePassword } from '../../core/models/user.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import * as _ from 'lodash';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { AuthService } from '../../core/services/common/auth.service';
import { Location } from '@angular/common';
import { JwtService } from '../../core/services/common/jwt.service';

@Component({
  selector: 'ceirpanel-change-password',
  templateUrl: '../html/change-password.component.html',
  styles: [
    `
      :host ::ng-deep .clr-input-group {
        width: 100% !important;
      }
    `,
  ],
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {
  userPassword: ChangePassword = {} as ChangePassword;
  public cancel = false;
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;

  constructor(
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private apicall: ApiUtilService,
    private router: Router,
    private el: ElementRef,
    public menuTransport: MenuTransportService,
    public authService: AuthService,
    public _location: Location,
    private jwtService: JwtService
  ) {}
  ngOnInit(): void {}
  onSubmit(userForm: NgForm) {
    if (userForm.invalid) {
      this.clrForm.markAsTouched();
      return;
    }

    this.apicall
      .post(`/api/auth/change-password`, this.userPassword)
      .subscribe({
        next: (_data) => {
          if (_.isEqual(_.get(_data, 'body.status'), 'failed')) {
            this.menuTransport.alert = {
              type: 'danger',
              message: _.get(_data, 'body.message'),
            };
          } else {
            this.menuTransport.alert = {
              type: 'success',
              message: _.get(_data, 'body.message'),
            };
            setTimeout(() => {
              this.logout();
              this.router.navigate(['/']);
            }, 5000);
          }
        },
      });
  }
  logout() {
    this.apicall.get('/api/auth/logout').subscribe({
      complete: () => {
        this.authService.purgeAuth('logout');
        localStorage.removeItem(`${this.jwtService.getWindow()}permissions`);
        return this.router.navigate(['/login']);
      },
    });
  }
  onOtpChange(event: unknown) {}
  ngAfterViewInit(): void {
    this.el.nativeElement
      .querySelector('input[type="password"]')
      .setAttribute('autocomplete', 'newPassword');
  }
}
