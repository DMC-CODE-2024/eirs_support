/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import * as _ from "lodash";
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { GroupList } from '../../core/models/group.model';
import { TicketList, TicketModel } from '../../core/models/ticket.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { ExportService } from '../../core/services/common/export.service';
import { DeviceService } from '../../core/services/device.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ceirpanel-ticket-list-by-user',
  template: `
  <clr-datagrid class="datagrid-compact mt-2" [clrDgLoading]="loading" (clrDgRefresh)="refresh($event)">
          <clr-dg-column>{{ "datalist.ticketId" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.phone" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.subject" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.createDate" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.modifiedDate" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.raisedBy" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.userType" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.status" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.action" | translate }}</clr-dg-column>
          <clr-dg-row *ngFor="let ticket of tickets; let i = index;" [clrDgItem]="ticket">
            <clr-dg-cell>G{{ticket.ticketId}}</clr-dg-cell>
            <clr-dg-cell>{{lodash.startsWith(ticket.mobileNumber, '+') ? ticket.mobileNumber: '+' + ticket.mobileNumber}}</clr-dg-cell>
            <clr-dg-cell>{{ticket.issue.subject}}</clr-dg-cell>
            <clr-dg-cell>{{ticket.issue.createdOn |date:'yyyy-MM-dd'}}</clr-dg-cell>
            <clr-dg-cell>{{ticket.issue.updatedOn |date:'yyyy-MM-dd'}}</clr-dg-cell>
            <clr-dg-cell class="text-truncate">{{ticket.raisedBy}}</clr-dg-cell>
            <clr-dg-cell class="text-truncate">{{ticket.userType}}</clr-dg-cell>
            <clr-dg-cell class="text-truncate">{{ticket.issue.status.name}}</clr-dg-cell>
            <clr-dg-cell class="m-0 p-0">
                <button class="btn btn-link btn-icon btn-sm m-0 m-0" [routerLink]="['/check-ticket-status/ticket-thread',ticket.ticketId]" [queryParams]="{msisdn:mobileNumber,redirect}">
                  <cds-icon shape="eye"></cds-icon>
                </button>
            </clr-dg-cell>
          </clr-dg-row>
          <clr-dg-footer>
            <clr-dg-pagination #pagination [clrDgPageSize]="10" [clrDgTotalItems]="total">
              <clr-dg-page-size [clrPageSizeOptions]="[10,20,50,100]">Tickets per page</clr-dg-page-size>
              {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}}
              of {{pagination.totalItems}} Tickets
            </clr-dg-pagination>
          </clr-dg-footer>
        </clr-datagrid>
  `,
  styles: [],
})
export class TicketListByUserComponent extends ExtendableListComponent {
  public tickets!: TicketModel[];
  public total!: number;
  public loading = true;
  public selected: any[] = [];
  @Input() public mobileNumber!: string;
  @Input() public ticketId!: string;
  @Input() public redirect!: string;
  lodash = _;

  constructor(
    private deviceService: DeviceService,
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private apicall: ApiUtilService,
    public exportService: ExportService,
    private router: Router) {
    super();
  }

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.state = state;
    this.applyFilter({contactNumber: this.mobileNumber});
    this.cdRef.detectChanges();
    this.apicall.post('/ticket/pagination', state).subscribe({
      next: (result) => {
        this.tickets = (result as TicketList).content;
        this.total = (result as TicketList).totalElements;
        console.log('total: ', this.total, ' size: ', this.tickets.length);
        this.loading = false;
        if(this.total === 1 ){
          this.router.navigate(['/check-ticket-status/ticket-thread', this.tickets[0].ticketId]);
        } else if((_.isArray(this.tickets) && this.tickets.length === 0) || (this.total === 0 && this.redirect==='register')) {
          this.router.navigate(['/ticket/register-ticket'],{queryParams:{msisdn: this.mobileNumber}});
        } 
        this.cdRef.detectChanges();
      },
      error: (e) => this.loading = false,
      complete: () => {
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }
  deleteRecord(data: any) {
    this.apicall.delete(`/group/${data.id}`).subscribe({
      next: (result) => {
        console.log('result:', result);
      },
      error: (e) => this.loading = false,
      complete: () => {
        console.log('completed');
        this.refresh(this.state);
      }
    });
  }
  openClose(open: boolean) {
    this.open = open;
    if (open && this.selectedData.length > 0){
      this.selectedData.forEach(data => this.deleteRecord(data));
    }
  }
  export(state: ClrDatagridStateInterface) {
    const st = _.cloneDeep(state);
    if(st && st.page) st.page.size = 1000;
    this.apicall.post('/group/pagination', st).subscribe({
      next: (result) => {
        const groups = (result as GroupList).content;
        this.exportService.groups(groups, `groups-${new Date().getMilliseconds()}`,{showLabels: true,headers: ["ID", "Created On", "Group Name","Parent Group Name"]});
      }
    });
  }
}