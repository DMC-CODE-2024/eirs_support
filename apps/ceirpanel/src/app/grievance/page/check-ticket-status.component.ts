/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _ from "lodash";
import { SearchImeiModel } from '../../core/models/search.imdi.model';
import { TicketModel } from '../../core/models/ticket.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { VerifyOtpForTicketComponent } from '../component/verify-otp-for-ticket.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { ConfigService } from 'ng-config-service';


@Component({
  selector: 'ceirpanel-check-ticket-status',
  templateUrl: '../html/check-ticket-status.component.html',
  styles: [``],
})
export class CheckTicketStatusComponent implements OnInit {
  imei: SearchImeiModel = {} as SearchImeiModel;
  public cancel = false;
  ticket: TicketModel = {} as TicketModel;
  minHeight: number | undefined;
  @ViewChild(VerifyOtpForTicketComponent, { static: false }) verifyOtp!: VerifyOtpForTicketComponent;
  public verified = false;
  mobileRegex!:string;
  msisdn!:string;
  countrycode!:string;
  redirect!:string;

  constructor(
   private apicall: ApiUtilService,
   private router: Router,
   private transport: MenuTransportService,
   public config: ConfigService,
   private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.countrycode = _.trim(this.config.get('countryCode') || '+265');
    this.countrycode = _.startsWith(this.countrycode, '+') ? this.countrycode.substring(1, this.countrycode.length) : this.countrycode;
    this.route.queryParams.subscribe(queryParams => {
      this.msisdn = _.trim(queryParams['msisdn'] || '');
      this.redirect = _.trim(queryParams['redirect'] || '');
      this.msisdn = _.startsWith(this.msisdn, this.countrycode) ? this.msisdn.substring(this.countrycode.length, this.msisdn.length) : this.msisdn;
      this.ticket.mobileNumber = this.msisdn;
      this.verified = _.isEmpty(this.ticket.mobileNumber) ? false: true;
    });
    this.apicall.get('/config/frontend').subscribe({  
      next: (data:any) => {
        this.mobileRegex = data.mobileRegexWithBlank;
      }
    });
  }
  onSubmit(userForm: NgForm) {
    this.verified = false;
    
    if(_.isEmpty(this.ticket.mobileNumber) && !_.isEmpty(this.ticket.ticketId)) {
      this.apicall.get(`/ticket/${this.ticket.ticketId}`).subscribe({
        next: (_data) => {
          if (_.isEqual(_.get(_data, 'message'), 'notValidTicketId')) {
            this.transport.alert = {
              message: 'notValidTicketId',
              type: 'info',
            } as unknown;
          } else {
            this.router.navigate(['/check-ticket-status/ticket-thread',this.ticket.ticketId]);
          }
        }
      });
    } else if(!_.isEmpty(this.ticket.mobileNumber)){
      this.verifyOtp.mobileNumber = this.ticket.mobileNumber;
      this.verifyOtp.clearTimer();
      this.verifyOtp.sendOtp();
      setTimeout(() => this.verifyOtp.openTimer(), 10);
    }
    console.log(userForm);
  }
  onOtpChange(event: unknown) {
    console.log(event);
  }
  
}
