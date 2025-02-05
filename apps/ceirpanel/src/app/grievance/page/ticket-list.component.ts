/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import * as _ from "lodash";
import { ConfigService } from 'ng-config-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { FilterModel } from '../../core/models/filter.model';
import { TicketList, TicketModel } from '../../core/models/ticket.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { AuthService } from '../../core/services/common/auth.service';
import { ExportService } from '../../core/services/common/export.service';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'ceirpanel-ticket-list',
  templateUrl: '../html/ticket-list.component.html',
  styles: [`.dropdown-toggle::after{display:none}`],
})
export class TicketListComponent extends ExtendableListComponent implements OnInit {
  public tickets!: TicketModel[];
  public total!: number;
  public loading = true;
  public selected: any[] = [];
  msisdn!:string;
  raisedBy!:string;
  status!:string;
  dashboard!:string;
  filterModel: FilterModel = {clientType: ''} as FilterModel;
  lodash =  _;
  rowSizeForExport!: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private apicall: ApiUtilService,
    public exportService: ExportService,
    private route: ActivatedRoute,
    public authService: AuthService,
    public permission: NgxPermissionsService,
    public config: ConfigService,
    private translate: TranslateService) {
    super();
    this.apicall.get('/config/frontend').subscribe({next: (data:any) => this.rowSizeForExport = data?.rowSizeForExport || 1000});
  }
  ngOnInit(): void {
    this.msisdn = this.route.snapshot.paramMap.get('msisdn') || '';
    this.raisedBy = this.route.snapshot.queryParamMap.get('raisedBy') || '';
    this.status = this.route.snapshot.queryParamMap.get('status') || '';
    this.dashboard = this.route.snapshot.queryParamMap.get('dashboard') || '';
    this.filterModel.ticketStatus = this.status;
    this.filterModel.raisedBy = this.raisedBy;
    this.filterModel.mobileNumber = this.msisdn;
    this.filterModel.dashboard = this.dashboard;
  }
  
  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.state = state;
    if(!_.isEmpty(this.msisdn))this.pushFilter({mobileNumber: this.msisdn});
    if(!_.isEmpty(this.raisedBy))this.pushFilter({raisedBy: this.raisedBy});
    if(!_.isEmpty(this.status))this.pushFilter({ticketStatus: this.status});
    if(!_.isEmpty(this.dashboard))this.pushFilter({dashboard: this.dashboard});
    this.applyExisterFilter();
    this.cdRef.detectChanges();
    this.apicall.post('/ticket/pagination', state).subscribe({
      next: (result) => {
        this.tickets = this.sortBy(state, (result as TicketList).content);
        this.total = (result as TicketList).totalElements;
        this.loading = false;
      },
      error: (e) => this.loading = false,
      complete: () => {
        this.loading = false;
      }
    });
  }
  deleteRecord(data: any) {
    this.apicall.delete(`/group/${data.id}`).subscribe({
      next: (result) => {
        
      },
      error: (e) => this.loading = false,
      complete: () => {
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
    if(st && st.page) st.page.size = this.rowSizeForExport;
    this.apicall.post('/ticket/pagination', st).subscribe({
      next: async (result) => {
        const groups = (result as TicketList).content;
        this.exportService.tickets(groups, `${_.now()}_viewticket`,
        {showLabels: true,headers: [
          await lastValueFrom(this.translate.get('datalist.createDate')),
          await lastValueFrom(this.translate.get('datalist.modifiedDate')),
          await lastValueFrom(this.translate.get('datalist.ticketId')),
          await lastValueFrom(this.translate.get('datalist.subject')),
          await lastValueFrom(this.translate.get('datalist.userId')),
          await lastValueFrom(this.translate.get('datalist.status'))
        ]});
      }
    });
  }
  nonadminexport(state: ClrDatagridStateInterface) {
    const st = _.cloneDeep(state);
    if(st && st.page) st.page.size = this.rowSizeForExport;
    this.apicall.post('/ticket/pagination', st).subscribe({
      next: async (result) => {
        const groups = (result as TicketList).content;
        this.exportService.ticketsnonadmin(groups, `${_.now()}_viewticket`,
        {showLabels: true,headers: [
          await lastValueFrom(this.translate.get('datalist.createDate')),
          await lastValueFrom(this.translate.get('datalist.modifiedDate')),
          await lastValueFrom(this.translate.get('datalist.ticketId')),
          await lastValueFrom(this.translate.get('datalist.contactNumber')),
          await lastValueFrom(this.translate.get('datalist.subject')),
          await lastValueFrom(this.translate.get('datalist.raisedBy')),
          await lastValueFrom(this.translate.get('datalist.status'))
        ]});
      }
    });
  }
}