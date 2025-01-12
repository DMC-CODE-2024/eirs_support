/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import * as _ from "lodash";
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { UserList } from '../../core/models/user.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { ExportService } from '../../core/services/common/export.service';
import { UserGroupDto } from '../dto/user-group.dto';

@Component({
  selector: 'ceirpanel-user-group-list-advanced',
  template: `
  <div class="card m-0 p-0" style="overflow: hidden;">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-5" style="margin-top: 5px;">
          <h4 class="card-title">{{ "userGroup.pageTitle.list" | translate }}</h4>
        </div>
        <div class="clr-col-6 m-0 p-0">
          <div class="btn-group btn-primary float-end">
            <ng-template [ngxPermissionsOnly]="['USER-GROUP_DELETE']" [ngxPermissionsOnlyThen]="showDelete"></ng-template>
            <ng-template #showDelete>
              <clr-toggle-container class="clr-toggle-right m-0 p-0 mt-1">
                <clr-toggle-wrapper>
                  <label>{{ "button.multiSelect" | translate }}</label>
                  <input type="checkbox" clrToggle (change)="changeView($event)"/>
                </clr-toggle-wrapper>
              </clr-toggle-container>
              <button class="btn btn-outline mx-1" aria-label="Check" [disabled]="!multiselect" (click)="confirmation(selecton)">
                <cds-icon shape="trash" solid="true" status="danger" badge="danger"></cds-icon>
              </button>
            </ng-template>
            <span *ngIf="showinfo">
              <ng-template [ngxPermissionsOnly]="['USER-GROUP_ADD']" [ngxPermissionsOnlyThen]="showAdd"></ng-template>
              <ng-template #showAdd>
                <button class="btn" aria-label="Check" [routerLink]="['add','']">
                  <cds-icon shape="plus" solid="true"status="neutral"></cds-icon> {{ "userGroup.pageTitle.add" | translate }}
                </button>
              </ng-template>
            </span>
          </div>  
        </div>
      </div>
    </div>
    <div class="card-block m-0 p-0">
        <clr-datagrid class="datagrid-compact" (clrDgRefresh)="refresh($event)" [clrDgLoading]="loading" class="mt-2" [(clrDgSelected)]="selecton">
          <clr-dg-column>{{ "datalist.createDate" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.firstName" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.lastName" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.userName" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.action" | translate }}</clr-dg-column>
          <clr-dg-row *ngFor="let gf of usergroups; let i = index;" [clrDgItem]="gf">
            <clr-dg-cell>{{gf?.user?.createdOn|date:'yyyy-MM-dd'}}</clr-dg-cell>
            <clr-dg-cell>{{gf?.user?.profile?.firstName}}</clr-dg-cell>
            <clr-dg-cell>{{gf?.user?.profile?.lastName}}</clr-dg-cell>
            <clr-dg-cell>{{gf?.user?.userName}}</clr-dg-cell>
            <clr-dg-cell>
              <clr-dropdown [clrCloseMenuOnItemClick]="false">
                <button clrDropdownTrigger aria-label="Dropdown demo button" class="m-0 p-0">
                  <cds-icon shape="ellipsis-vertical"></cds-icon>
                </button>
                <clr-dropdown-menu *clrIfOpen [clrPosition]="'bottom-right'">
                  <ng-template [ngxPermissionsOnly]="['USER-GROUP_VIEW']" [ngxPermissionsOnlyThen]="showView" [ngxPermissionsOnlyElse]="hideView"></ng-template>
                  <ng-template #showView>
                    <button class="action-item" [routerLink]="['/user-group/view',gf?.id?.userId]" clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideView>
                    <button class="action-item" [routerLink]="['/user-group/view',gf?.id?.userId]" disabled clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['USER-GROUP_EDIT']" [ngxPermissionsOnlyThen]="showEdit" [ngxPermissionsOnlyElse]="hideEdit"></ng-template>
                  <ng-template #showEdit>
                    <button class="action-item" [routerLink]="['/user-group/edit',gf?.id?.userId]" clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideEdit>
                    <button class="action-item" [routerLink]="['/user-group/edit',gf?.id?.userId]" disabled clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['USER-GROUP_DELETE']" [ngxPermissionsOnlyThen]="showDelete" [ngxPermissionsOnlyElse]="hideDelete"></ng-template>
                  <ng-template #showDelete>
                    <button class="action-item" (click)="confirmation([gf])" clrDropdownItem>
                      <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideDelete>
                    <button class="action-item" (click)="confirmation([gf])" disabled clrDropdownItem>
                      <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                    </button>
                  </ng-template>
                </clr-dropdown-menu>
              </clr-dropdown>
            </clr-dg-cell>
          </clr-dg-row>
          <clr-dg-footer>
            <clr-dg-pagination #pagination [clrDgPageSize]="10" [clrDgTotalItems]="total">
              <clr-dg-page-size [clrPageSizeOptions]="[10,20,50,100]"><span class="text-capitalize">{{ "footer.userGroups"| translate }}</span> {{ "footer.perPage"| translate }}</clr-dg-page-size>
              {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}}
              {{ "footer.of"| translate }} {{pagination.totalItems}} {{ "footer.userGroups"| translate }}
            </clr-dg-pagination>
          </clr-dg-footer>
        </clr-datagrid>
  </div>
  <ceirpanel-user-group-delete [open]="open" (confirmation)="openClose($event)" [groups]="selectedData" *ngIf="selectedData.length > 0"></ceirpanel-user-group-delete>
  `,
  styles: [`.dropdown-toggle::after{display:none}`],
})
export class UserGroupListAdvancedComponent extends ExtendableListComponent {
  public usergroups!: UserGroupDto[];
  public total!: number;
  public loading = true;
  public selected: any[] = [];
  showinfo = true;
  groupId = 0;
  constructor(
    private cdRef: ChangeDetectorRef,
    private apicall: ApiUtilService,
    public exportService: ExportService,
    route: ActivatedRoute) {
    super();
    route.params.subscribe(param => {
        this.groupId = param['groupId'] || 0;
        if(this.state)this.refresh(this.state);
    });
    route.url.subscribe(() => {
      const parent = route?.snapshot?.parent?.url[0]?.path;
      if (_.isEqual(parent, 'group-assistent')) {
        this.showinfo = false;
      }
     });
  }

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.state = state;
    this.cdRef.detectChanges();
    this.applyFilter({groupId: this.groupId});
    this.applyExisterFilter();
    this.apicall.post('/userGroup/pagination', state).subscribe({
      next: (result) => {
        this.usergroups = (result as any).content;
        this.total = (result as UserList).totalElements;
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }
  openClose(open: boolean) {
    this.open = open;
    if (open && this.selectedData.length > 0){
      this.selectedData.forEach(d => {
        const groups = d.groups.map((g: { id: number; }) => g.id).filter((g: number) => g != this.groupId);
        this.deleteRecord({userId: d.id, groups});
      });
    }
  }
  deleteRecord(data: any) {
    this.apicall.put(`/userGroup/update/${data.userId}`, data).subscribe({
        next: (result) => {
            this.selectedData = [];
            this.selecton = null;
            this.refresh(this.state);
        }
    });
  }
}
