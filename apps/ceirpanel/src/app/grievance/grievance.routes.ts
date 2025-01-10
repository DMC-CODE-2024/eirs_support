import { Route } from '@angular/router';
import { RegisterTicketSuccessComponent } from './page/register-ticket-success.component';
import { CheckTicketStatusComponent } from './page/check-ticket-status.component';
import { SearchImeiResultComponent } from './page/search.imei.result.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { LoginGuard } from '../core/guards/login.guard';
import { SearchImeiComponent } from './page/search.imei.component';
import { ViewTicketComponent } from './page/view-ticket.component';
import { VerifyTicketOtpComponent } from './page/verify-ticket-top.component';
import { ForgotTicketComponent } from './page/forgot-ticket.component';
import { RegisterTicketComponent } from './page/register-ticket.component';
import { TicketListComponent } from './page/ticket-list.component';
import { ViewTicketThreadComponent } from './page/view-ticket-thread.component';
import { DashboardComponent } from './page/dashboard.component';
import { EndUserTicketListComponent } from './page/enduser-ticket-list.component';
import { XcallyCheckTicketStatusComponent } from './page/xcally-check-ticket-status.component';
import { NotLoginGuard } from '../core/guards/not-login.guard';

export const routes: Route[] = [
  {
    path: 'ticket',
    component: TicketListComponent,
    canActivate: [LoginGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['TICKET'],
        redirectTo: {
          default: 'access-denied',
        },
      },
    },
  },
  {
    path: 'ticket/end-user/list/:msisdn',
    component: EndUserTicketListComponent,
  },
  /*...['register-ticket'].map((path) => ({
    path,
    component: RegisterTicketComponent,
  })),*/
  ...['forgot-ticket', 'forgot-ticket/:msisdn'].map((path) => ({
    path,
    component: ForgotTicketComponent,
  })),
  { path: 'verify-ticket-otp/:msisdn', component: VerifyTicketOtpComponent },
  { path: 'view-ticket', component: ViewTicketComponent },
  {
    path: 'search-imei',
    component: SearchImeiComponent,
    canActivate: [LoginGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['SEARCH IMEI'],
        redirectTo: {
          default: 'access-denied',
        },
      },
    },
  },
  {
    path: 'ticket/register-ticket-success/:ticketId',
    component: RegisterTicketSuccessComponent,
  },
  {
    path: 'register-ticket/register-ticket-success/:ticketId',
    component: RegisterTicketSuccessComponent,
  },
  {
    path: 'check-ticket-status',
    component: CheckTicketStatusComponent,
    canActivate: [LoginGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['TICKET_VIEW'],
        redirectTo: {
          default: 'access-denied',
        },
      },
    },
  },
  {
    path: 'xcally/check-ticket-status',
    component: XcallyCheckTicketStatusComponent
  },
  {
    path: 'check-ticket-status/ticket-thread/:ticketId',
    canActivate: [LoginGuard, NgxPermissionsGuard],
    component: ViewTicketThreadComponent,
    data: {
      permissions: {
        only: ['TICKET_VIEW'],
        redirectTo: {
          default: 'access-denied',
        },
      },
    }
  },
  {
    path: 'search-imei/result',
    component: SearchImeiResultComponent,
    canActivate: [LoginGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['SEARCH IMEI'],
        redirectTo: {
          default: 'access-denied',
        },
      },
    },
  },
  {
    path: 'ticket/ticket-thread/:ticketId',
    component: ViewTicketThreadComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [LoginGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['DASHBOARD'],
        redirectTo: {
          default: 'access-denied',
        },
      },
    },
  },
  { 
    path: 'register-ticket', component: RegisterTicketComponent,
    canActivate: [NotLoginGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['TICKET_ADD'],
        redirectTo: {
          default: 'access-denied',
        },
      },
    },
  },
  { path: 'ticket/register-ticket', component: RegisterTicketComponent },
];
