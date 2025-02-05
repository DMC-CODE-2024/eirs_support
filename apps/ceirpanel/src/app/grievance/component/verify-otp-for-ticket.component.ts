/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { TicketModel } from '../../core/models/ticket.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { OtpModel } from '../../core/models/otp.model';
import * as _ from 'lodash';
import { ConfigService } from 'ng-config-service';
import { NgOtpInputComponent } from 'ng-otp-input';
import { SimpleTimer } from 'ng2-simple-timer';

@Component({
  selector: 'ceirpanel-verify-ticket-otp',
  template: `
    <clr-modal [(clrModalOpen)]="open" [clrModalStaticBackdrop]="false" [clrModalClosable]="false">
      <div class="modal-body">
        <form clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" (ngSubmit)="f.form.valid && onSubmit(f)">
          <clr-alert *ngIf="alert" [clrAlertType]="alert.type" [clrAlertAppLevel]="true">
            <clr-alert-item>
              <span class="alert-text text-white">{{ "message." + alert.message | translate }}</span>
            </clr-alert-item>
          </clr-alert>
          <figure class="text-center">
            <blockquote class="blockquote">
              <h3>
                <small class="fs-5 fw-bold" style="color: #1E4076;">View Ticket Status</small>
              </h3>
            </blockquote>
            <figcaption class="blockquote-footer m-0 p-0 mt-1">
              SMS verify code sent to phone number
              <cite title="Source Title">{{config.get('countryCode') || '+855'}} {{ mobileNumber }}</cite>
              <p class="m-0 p-0">Please enter the code to verify</p>
            </figcaption>
          </figure>
          <div class="clr-row">
            <div class="clr-col-12 text-center m-0 p-0">
              <ng-otp-input (onInputChange)="onOtpChange($event)" [config]="{ length: allowedOtpLength, allowNumbersOnly:true }"></ng-otp-input>
            </div>
          </div>
          <div class="clr-row mt-3">
            <div class="clr-col-12 text-center m-0 p-0">
              <button type="submit" class="btn btn-primary btn-block m-0 p-0">
                Verify
              </button>
            </div>
          </div>
          <div class="clr-row clr-justify-content-center m-0 p-0">
            <div class="clr-col-4 m-0 p-0">
              <button type="button" class="btn btn-link m-0 p-0" [disabled]="timeLeft > 0" (click)="sendOtp()">Resend </button>
            </div>
            <div class="clr-col-4 text-end m-0 p-0">
              <button type="button" class="btn btn-link m-0 p-0" (click)="open = false">Back</button>
            </div>
          </div>
          <div class="clr-row clr-justify-content-center">
            <div class="clr-col-4 m-0 p-0">
              <p class="m-0 p-0 text-primary">
                Time remaining: 00:{{ timeLeftDisplay }}
              </p>
            </div>
            <div class="clr-col-4 text-end m-0 p-0"></div>
          </div>
        </form>
      </div>
    </clr-modal>
  `,
  styles: [``],
})
export class VerifyOtpForTicketComponent extends ExtendableListComponent {
  
  public tickets!: TicketModel[];
  public total!: number;
  public loading = true;
  public selected: any[] = [];
  public override open = false;
  @Input() public mobileNumber!: string;
  @Input() public ticketid!: number;
  otpModel: OtpModel = { otp: '' } as OtpModel;
  @Output() public verifyEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild(NgOtpInputComponent, { static: false}) ngOtpInput!:NgOtpInputComponent;
  countdown: any = '00';
  timerobj: any;
  finished = false;
  subscribeTimer = 20;
  timeLeft = 20;
  timer = 20;
  interval!: any;
  timeLeftDisplay = "00";
  alert!:any;
  countryCode = '+855';
  allowedOtpLength = 6;
  timerId!: string;


  constructor(private apicall: ApiUtilService, public config: ConfigService, public st: SimpleTimer) {
    super();
    this.subscribeTimer = this.config.get('otpTimerTime') || 60;
    this.timeLeft = this.config.get('otpTimerTime') || 60;
    this.countryCode = this.config.get('countryCode') || '+855';
    this.countryCode = _.startsWith(this.countryCode, '+') ? this.countryCode.substring(1, this.countryCode.length) : this.countryCode;
    this.allowedOtpLength = this.config.get('allowedOtpLength') || 6;
  }

  public clearTimer() {
    this.ngOtpInput.setValue('');
    this.timeLeft = this.config.get('otpTimerTime') || 60;
    clearInterval(this.interval);
  }
  public openTimer() {
    setTimeout(() => (this.open = true), 100);
  }
  sendOtp() {
    this.clearTimer();
    this.finished = false;
    let countrycode = _.trim(this.config.get('countryCode') || '+265');
    countrycode = _.startsWith(countrycode, '+') ? countrycode.substring(1, countrycode.length) : countrycode;
    const lang = _.isEmpty(localStorage.getItem(`${window.name}lang`) || 'us') ? 'us' : localStorage.getItem(`${window.name}lang`) || 'us';
    this.apicall.get(`/ticket/send-otp/${countrycode}${this.mobileNumber}/${lang}`).subscribe({
      next: (result) => {
        this.startTimer();
      },
    });
  }
  onSubmit(userForm: NgForm) {
    this.otpModel.mobileNumber = this.mobileNumber;
    this.verifyOtp();
  }
  onOtpChange(event: unknown) {
    this.otpModel.otp = event as string;
  }
  verifyOtp() {
    let countrycode = _.trim(this.config.get('countryCode') || '+265');
    countrycode = _.startsWith(countrycode, '+') ? countrycode.substring(1, countrycode.length) : countrycode;
    this.apicall
      .get(`/ticket/verify-otp/${countrycode}${this.mobileNumber}/${this.otpModel.otp}`)
      .subscribe({
        next: (result) => {
          if (_.isEqual(_.get(result, 'message'), 'verifyOtpSuccess')) {
            this.verifyEvent.emit(true);
          } else {
            this.alert = {type: 'danger', message: _.get(result,'message')};
            setTimeout(() => this.alert = null, 10000);
          }
        },
      });
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
    this.ngOtpInput.setValue('');
    this.st.unsubscribe(this.timerId);
  }
  
}
