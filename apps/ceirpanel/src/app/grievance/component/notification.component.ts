/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectorRef, Component } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { GroupList } from '../../core/models/group.model';
import { TicketList, TicketModel } from '../../core/models/ticket.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { ExportService } from '../../core/services/common/export.service';
import { DeviceService } from '../../core/services/device.service';
import * as _ from "lodash";

@Component({
  selector: 'ceirpanel-notification',
  template: `
    <h4 class="card-title text-capitalize m-0 p-0 mt-3">{{ "device.pageTitle.notification" | translate }}</h4>
    <clr-datagrid
      class="datagrid-compact"
      [clrDgLoading]="loading"
      (clrDgRefresh)="refresh($event)"
    >
      <clr-dg-column>{{ 'datalist.createDate' | translate }}</clr-dg-column>
      <clr-dg-column>{{ 'datalist.tid' | translate }}</clr-dg-column>
      <clr-dg-column>{{ 'datalist.feature' | translate }}</clr-dg-column>
      <clr-dg-column>{{ 'datalist.message' | translate }}</clr-dg-column>
      <clr-dg-row
        *ngFor="let ticket of tickets; let i = index"
        [clrDgItem]="ticket"
      >
        <clr-dg-cell>{{ ticket.createdOn | date : 'yyyy-MM-dd' }}</clr-dg-cell>
        <clr-dg-cell>{{ ticket.ticketId | date : 'yyyy-MM-dd' }}</clr-dg-cell>
        <clr-dg-cell>{{ ticket.mobileNumber }}</clr-dg-cell>
        <clr-dg-cell>{{ ticket.subject }}</clr-dg-cell>
        <clr-dg-action-overflow>
          <ng-template
            [ngxPermissionsOnly]="['GROUP_VIEW']"
            [ngxPermissionsOnlyThen]="showView"
            [ngxPermissionsOnlyElse]="hideView"
          ></ng-template>
          <ng-template #showView>
            <button class="action-item" [routerLink]="['view', ticket.ticketId]">
              <cds-icon shape="view-list"></cds-icon>
              {{ 'button.view' | translate }}
            </button>
          </ng-template>
          <ng-template #hideView>
            <button
              class="action-item"
              [routerLink]="['view', ticket.ticketId]"
              disabled
            >
              <cds-icon shape="view-list"></cds-icon>
              {{ 'button.view' | translate }}
            </button>
          </ng-template>
          <ng-template
            [ngxPermissionsOnly]="['GROUP_EDIT']"
            [ngxPermissionsOnlyThen]="showEdit"
            [ngxPermissionsOnlyElse]="hideEdit"
          ></ng-template>
          <ng-template #showEdit>
            <button class="action-item" [routerLink]="['edit', ticket.ticketId]">
              <cds-icon shape="pencil"></cds-icon>
              {{ 'button.edit' | translate }}
            </button>
          </ng-template>
          <ng-template #hideEdit>
            <button
              class="action-item"
              [routerLink]="['edit', ticket.ticketId]"
              disabled
            >
              <cds-icon shape="pencil"></cds-icon>
              {{ 'button.edit' | translate }}
            </button>
          </ng-template>
          <ng-template
            [ngxPermissionsOnly]="['GROUP_DELETE']"
            [ngxPermissionsOnlyThen]="showDelete"
            [ngxPermissionsOnlyElse]="hideDelete"
          ></ng-template>
          <ng-template #showDelete>
            <button class="action-item" (click)="confirmation([ticket])">
              <cds-icon shape="trash"></cds-icon>
              {{ 'button.delete' | translate }}
            </button>
          </ng-template>
          <ng-template #hideDelete>
            <button
              class="action-item"
              (click)="confirmation([ticket])"
              disabled
            >
              <cds-icon shape="trash"></cds-icon>
              {{ 'button.delete' | translate }}
            </button>
          </ng-template>
        </clr-dg-action-overflow>
      </clr-dg-row>
      <clr-dg-footer>
        <clr-dg-pagination
          #pagination
          [clrDgPageSize]="10"
          [clrDgTotalItems]="total"
        >
          <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]"
            ><span class="text-capitalize">{{
              'footer.groups' | translate
            }}</span>
            {{ 'footer.perPage' | translate }}</clr-dg-page-size
          >
          {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }}
          {{ 'footer.of' | translate }} {{ pagination.totalItems }}
          {{ 'footer.groups' | translate }}
        </clr-dg-pagination>
      </clr-dg-footer>
    </clr-datagrid>
  `,
  styles: [``],
})
export class NotificationComponent  extends ExtendableListComponent  {
    public tickets!: TicketModel[];
    public total!: number;
    public loading = true;
    public selected: any[] = [];
  
    constructor(
      private deviceService: DeviceService,
      private cdRef: ChangeDetectorRef,
      private translate: TranslateService,
      private apicall: ApiUtilService,
      public exportService: ExportService) {
      super();
    }
  
    refresh(state: ClrDatagridStateInterface) {
      this.loading = true;
      this.state = state;
  
      this.cdRef.detectChanges();
      this.apicall.post('/ticket/pagination', state).subscribe({
        next: (result) => {
          this.tickets = (result as TicketList).content;
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
      if(st && st.page) st.page.size = 1000;
      this.apicall.post('/group/pagination', st).subscribe({
        next: (result) => {
          const groups = (result as GroupList).content;
          this.exportService.groups(groups, `groups-${new Date().getMilliseconds()}`,{showLabels: true,headers: ["ID", "Created On", "Group Name","Parent Group Name"]});
        }
      });
    }
}
