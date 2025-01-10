/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { TicketModel } from '../../core/models/ticket.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { ConfigService } from 'ng-config-service';

@Component({
  selector: 'ceirpanel-register-ticket',
  templateUrl: '../html/forgot-ticket.component.html',
  styles: [`
  :host ::ng-deep .input-group-sm>.btn, .input-group-sm>.form-control, .input-group-sm>.form-select, .input-group-sm>.input-group-text {
    font-size: 16px;
  }
  `],
})
export class ForgotTicketComponent implements OnInit {
  ticket: TicketModel = {} as TicketModel;
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
  lang = 'us';
  countryCode = 'EIRS';
  header = 'yes';
  mobileRegex!:string;

  constructor(
    private cdref: ChangeDetectorRef, 
    private route: ActivatedRoute, 
    private translate: TranslateService,
    private apicall: ApiUtilService,
    public config: ConfigService,
    private router: Router) {
      this.countryCode = this.config.get('countryCode') || '+855';
      this.countryCode = _.startsWith(this.countryCode, '+') ? this.countryCode.substring(1, this.countryCode.length) : this.countryCode;
      this.ticket.mobileNumber = this.route.snapshot.paramMap.get('msisdn') || '';
      this.route.queryParams.subscribe(queryParams => {
        this.lang = queryParams['lang'] || 'us';
        this.header = queryParams['header'] || 'yes';
      });
      this.apicall.get('/config/frontend').subscribe({  
        next: (data:any) => {
          this.mobileRegex = data.mobileRegex;
        }
      });
  }

  ngOnInit(): void {
    console.log();
  }
  onSubmit(userForm: NgForm) {
    if (userForm.invalid) {
      this.clrForm.markAsTouched();
      return;
    }
    this.sendotp();
  }
  sendotp(){
    this.apicall.get(`/ticket/send-otp/${this.countryCode}${this.ticket.mobileNumber}`).subscribe({
      next: (_data) => {
        console.log('message:', _data as any);
        if(_.isEqual((_data as any).message, 'sendOtpSuccess')) {
          this.router.navigate(['/verify-ticket-otp',this.ticket.mobileNumber], {queryParams:{lang: this.lang,header: this.header}});
        }
      }
    });
  }
}
