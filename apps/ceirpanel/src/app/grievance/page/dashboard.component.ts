/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { JwtService } from '../../core/services/common/jwt.service';
import * as _ from 'lodash';

@Component({
  selector: 'ceirpanel-ticket-dashboard',
  templateUrl: '../html/dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit {
  dashboard:any;
  lodash = _;
  constructor(
    private apicall: ApiUtilService,
    public jwtService: JwtService
  ) {}
  ngOnInit(): void {
    this.apicall.get(`/ticket/dashboard`).subscribe({
        next: (_data) => {
            this.dashboard = _data as any;
            this.dashboard.allDashboard.totalTickets = this.dashboard?.allDashboard?.totalTickets ? this.dashboard.allDashboard.totalTickets: 0;
            this.dashboard.allDashboard.openTickets = this.dashboard?.allDashboard?.openTickets ? this.dashboard.allDashboard.openTickets: 0;
            this.dashboard.allDashboard.inProgressTickets = this.dashboard?.allDashboard?.inProgressTickets ? this.dashboard.allDashboard.inProgressTickets: 0;
            this.dashboard.allDashboard.resolvedTickets = this.dashboard?.allDashboard?.resolvedTickets ? this.dashboard.allDashboard.resolvedTickets: 0;
            this.dashboard.allDashboard.closedTickets = this.dashboard?.allDashboard?.closedTickets ? this.dashboard.allDashboard.closedTickets: 0;

            this.dashboard.myDashboard.totalTickets = this.dashboard?.myDashboard?.totalTickets ? this.dashboard.myDashboard.totalTickets: 0;
            this.dashboard.myDashboard.openTickets = this.dashboard?.myDashboard?.openTickets ? this.dashboard.myDashboard.openTickets: 0;
            this.dashboard.myDashboard.inProgressTickets = this.dashboard?.myDashboard?.inProgressTickets ? this.dashboard.myDashboard.inProgressTickets: 0;
            this.dashboard.myDashboard.resolvedTickets = this.dashboard?.myDashboard?.resolvedTickets ? this.dashboard.myDashboard.resolvedTickets: 0;
            this.dashboard.myDashboard.closedTickets = this.dashboard?.myDashboard?.closedTickets ? this.dashboard.myDashboard.closedTickets: 0;
        }
    });
  }
  onOtpChange(event: unknown) {
   
  }
}
