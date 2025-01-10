import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'ceirpanel-change-password',
  templateUrl: '../html/change-password.component.html',
  styles: [`
  :host ::ng-deep .clr-input-group {
    width: 100% !important;
  }
  `],
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
    public _location: Location) {
      
  }
  ngOnInit(): void {
    console.log();
  }
  onSubmit(userForm: NgForm) {
    console.log('user: ', userForm);
    if (userForm.invalid) { this.clrForm.markAsTouched(); return; }

    console.log('user: ', userForm);
    this.apicall.post(`/api/auth/change-password`, this.userPassword).subscribe({
        next: (_data) => {
          console.log('data: ', _data);
          console.log('message: ', _.get(_data,'body.message'));
          if (_.isEqual(_.get(_data, 'body.status'), 'failed')) {
            this.menuTransport.alert = {type: 'danger', message: _.get(_data,'body.message')};
          } else {
            this.menuTransport.alert = {type: 'success', message: _.get(_data,'body.message')};
            setTimeout(() => {
              this.logout();
              this.router.navigate(['/']);
            }, 5000);
          }
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {
          console.log('completed');
        }
    });

  }
  logout() {
    this.apicall.get('/api/auth/logout').subscribe({
      complete: () => {
        this.authService.purgeAuth('logout');
        localStorage.removeItem('permissions');
        return this.router.navigate(['/login']); 
      }
    });
  }
  onOtpChange(event: unknown){
    console.log(event);
  }
  ngAfterViewInit(): void {
    this.el.nativeElement.querySelector('input[type="password"]').setAttribute('autocomplete', 'newPassword');
  }
}
