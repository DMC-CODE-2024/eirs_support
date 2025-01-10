/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { TicketModel } from '../../core/models/ticket.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { ConfigService } from 'ng-config-service';
import { NgOtpInputComponent } from 'ng-otp-input';
import { SimpleTimer } from 'ng2-simple-timer';

@Component({
  selector: 'ceirpanel-ticket-otp',
  templateUrl: '../html/verify-ticket-otp.component.html',
  styles: [``],
})
export class VerifyTicketOtpComponent implements OnInit {
  @ViewChild(NgOtpInputComponent, { static: false}) ngOtpInput!:NgOtpInputComponent;
  ticket: TicketModel = {} as TicketModel;
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
  otp!: string;
  subscribeTimer = 20;
  timeLeft = 20;
  interval!: any;
  timeLeftDisplay = "00";
  alert!:any;
  allowedOtpLength = 6;
  timerId!: string;
  lang = 'us';
  header = 'yes';
  otpCurrentLimit = 1;
  otpMaxResendLimit = 3;

  constructor(
    private cdref: ChangeDetectorRef, 
    private route: ActivatedRoute, 
    private translate: TranslateService,
    private apicall: ApiUtilService,
    public config: ConfigService,
    public st: SimpleTimer,
    private router: Router,private transport: MenuTransportService) {
      this.ticket.mobileNumber = this.route.snapshot.paramMap.get('msisdn') || '';
      this.subscribeTimer = this.config.get('otpTimerTime') || 60;
      this.otpMaxResendLimit = this.config.get('otpMaxResendLimit') || 3;
      this.timeLeft = this.config.get('otpTimerTime') || 60;
      this.allowedOtpLength = this.config.get('allowedOtpLength') || 6;
      this.route.queryParams.subscribe(queryParams => {
        this.lang = queryParams['lang'] || 'us';
        this.header = queryParams['header'] || 'yes';
      });
  }


  ngOnInit(): void {
    this.alert = {type: 'success', message: _.get({message: 'sendOtpSuccess'},'message')};
    setTimeout(() => this.alert = null, 5000);
    this.startTimer();
  }
  onSubmit(userForm: NgForm) {
    if (userForm.invalid) {
      this.clrForm.markAsTouched();
      return;
    }
    let countrycode = _.trim(this.config.get('countryCode') || '+855');
    countrycode = _.startsWith(countrycode, '+') ? countrycode.substring(1, countrycode.length) : countrycode;
    this.apicall.get(`/ticket/verify-otp/${countrycode}${this.ticket.mobileNumber}/${this.otp}`).subscribe({
      next: (_data) => {
        console.log('message:', _data as any);
        if(_.isEqual((_data as any).message, 'verifyOtpSuccess')) {
          if(_.eq((_data as any).size, 1)) {
            this.router.navigate(['/ticket/ticket-thread',(_data as any).id], {queryParams:{lang: this.lang,header: this.header}});
          } else {
            this.router.navigate(['/ticket/end-user/list',this.ticket.mobileNumber], {queryParams:{lang: this.lang,header: this.header}});
          }
        } else {
          this.alert = {type: 'danger', message: _.get(_data,'message')};
          setTimeout(() => this.alert = null, 10000);
        }
      }
    });
  }
  onOtpChange(event: unknown){
    this.otp = event as any;
  }
  
  startTimer() {
    this.timeLeft = this.config.get('otpTimerTime') || 60;
    this.st.newTimer(`1sec`, 1, true);
    this.timerId = this.st.subscribe('1sec', () => this.callback());
  }
  callback() {
    this.timeLeft--;
    if(String(this.timeLeft).length == 1)this.timeLeftDisplay = `0${this.timeLeft}`;
    else this.timeLeftDisplay = `${this.timeLeft}`;
    if(this.timeLeft <= 0) {
      this.st.unsubscribe(this.timerId);
    }
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
  sendotp(){
    if(this.otpCurrentLimit >= this.otpMaxResendLimit) {
      this.alert = {type: 'warning', message: _.get({message: 'otpMaxLimitReached'},'message')};
      setTimeout(() => this.alert = null, 5000);
    } else {
      let countrycode = _.trim(this.config.get('countryCode') || '+265');
      countrycode = _.startsWith(countrycode, '+') ? countrycode.substring(1, countrycode.length) : countrycode;
      this.ngOtpInput.setValue('');
      this.otpCurrentLimit = this.otpCurrentLimit + 1;
      this.apicall.get(`/ticket/send-otp/${countrycode}${this.ticket.mobileNumber}`).subscribe({
        next: (_data) => {
          console.log('message:', _data as any);
          if(_.isEqual((_data as any).message, 'sendOtpSuccess')) {
            this.transport.alert = {message: 'sendOtpSuccess',type: 'info'} as unknown;
            this.alert = {type: 'success', message: _.get(_data,'message')};
            setTimeout(() => this.alert = null, 5000);
            this.timeLeft = this.subscribeTimer;
            this.startTimer();
          } else {
            this.alert = {type: 'danger', message: _.get(_data,'message')};
            setTimeout(() => this.alert = null, 5000);
          }
        }
      });
    }
  }
}
