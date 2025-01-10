import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { AngularResizeEventModule } from 'angular-resize-event';
import { NgOtpInputModule } from 'ng-otp-input';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { ValidateEqualModule } from 'ng-validate-equal';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';
import { NgxStarsModule } from 'ngx-stars';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { ValidateImeiDirective } from '../core/directive/imei.validator';
import { DeviceStateComponent } from './component/device-state.component';
import { DeviceStatusComponent } from './component/device-status.component';
import { NotificationComponent } from './component/notification.component';
import { TicketFeedbackComponent } from './component/ticket-feedback.component';
import { TicketResolveComponent } from './component/ticket-resolve.component';
import { TicketListByUserComponent } from './component/ticket.list.by.user.component';
import { VerifyOtpForTicketComponent } from './component/verify-otp-for-ticket.component';
import { routes } from './grievance.routes';
import { CheckTicketStatusComponent } from './page/check-ticket-status.component';
import { DashboardComponent } from './page/dashboard.component';
import { ForgotTicketComponent } from './page/forgot-ticket.component';
import { RegisterTicketSuccessComponent } from './page/register-ticket-success.component';
import { RegisterTicketComponent } from './page/register-ticket.component';
import { SearchImeiComponent } from './page/search.imei.component';
import { SearchImeiResultComponent } from './page/search.imei.result.component';
import { TicketListComponent } from './page/ticket-list.component';
import { VerifyTicketOtpComponent } from './page/verify-ticket-top.component';
import { ViewTicketThreadComponent } from './page/view-ticket-thread.component';
import { ViewTicketComponent } from './page/view-ticket.component';
import { ValidateTicketIdDirective } from '../core/directive/ticket.id.validator';
import { EmailBlankValidatorDirective } from '../core/directive/email.blank.validator';
import { MobileBlankValidatorDirective } from '../core/directive/mobile.blank.validator';
import { EndUserTicketListComponent } from './page/enduser-ticket-list.component';
import { XcallyCheckTicketStatusComponent } from './page/xcally-check-ticket-status.component';


@NgModule({
  declarations: [
    TicketListComponent,
    RegisterTicketComponent,
    ValidateImeiDirective,
    ValidateTicketIdDirective,
    ForgotTicketComponent,
    VerifyTicketOtpComponent,
    ViewTicketComponent,
    SearchImeiComponent,
    RegisterTicketSuccessComponent,
    CheckTicketStatusComponent,
    SearchImeiResultComponent,
    NotificationComponent,
    VerifyOtpForTicketComponent,
    TicketListByUserComponent,
    ViewTicketThreadComponent,
    TicketResolveComponent,
    DashboardComponent,
    TicketFeedbackComponent,
    DeviceStateComponent,
    DeviceStatusComponent,
    EndUserTicketListComponent,
    EmailBlankValidatorDirective,
    MobileBlankValidatorDirective,
    XcallyCheckTicketStatusComponent
  ],
  imports: [
    NgOtpInputModule,
    AngularResizeEventModule,
    NgxQrcodeStylingModule,
    NgxStarsModule,
    CeirCommonModule, 
    ValidateEqualModule,
    RouterModule.forChild(routes),
    NgxPermissionsModule,
    AngularDualListBoxModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
})
export class GrievanceModule {}
