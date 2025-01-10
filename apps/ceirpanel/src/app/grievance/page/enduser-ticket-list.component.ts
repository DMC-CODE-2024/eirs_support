/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import * as _ from "lodash";
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { GroupList } from '../../core/models/group.model';
import { TicketList, TicketModel } from '../../core/models/ticket.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { AuthService } from '../../core/services/common/auth.service';
import { ExportService } from '../../core/services/common/export.service';
import { FilterModel } from '../../core/models/filter.model';
import { NgxPermissionsService } from 'ngx-permissions';
import { ConfigService } from 'ng-config-service';


@Component({
  selector: 'ceirpanel-enduser-ticket-list',
  templateUrl: '../html/enduser-ticket-list.component.html',
  styles: [`.dropdown-toggle::after{display:none}`],
})
export class EndUserTicketListComponent extends ExtendableListComponent implements OnInit {
  public tickets!: TicketModel[];
  msisdn!:string;
  public loading = true;
  public total!: number;
  lang = 'us';
  header = 'yes';
  constructor(
    private cdRef: ChangeDetectorRef,
    private apicall: ApiUtilService,
    public exportService: ExportService,
    private route: ActivatedRoute,
    public authService: AuthService,
    private permission: NgxPermissionsService,
    public config: ConfigService) {
    super();
  }
  ngOnInit(): void {
    this.msisdn = this.route.snapshot.paramMap.get('msisdn') || '';
    this.route.queryParams.subscribe(queryParams => {
      this.lang = queryParams['lang'] || 'us';
      this.header = queryParams['header'] || 'yes';
    });
  }
  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.state = state;

    let countrycode = _.trim(this.config.get('countryCode') || '+265');
    countrycode = _.startsWith(countrycode, '+') ? countrycode.substring(1, countrycode.length) : countrycode;

    this.apicall.post(`/ticket/${countrycode}${this.msisdn}/pagination`, state).subscribe({
      next: (result) => {
        this.tickets = this.sortBy(state, (result as TicketList).content);
        this.total = (result as TicketList).totalElements;
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (e) => this.loading = false,
      complete: () => {
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }
  
}