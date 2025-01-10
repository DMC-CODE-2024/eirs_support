/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridPagination, ClrDatagridStateInterface } from '@clr/angular';
import * as _ from "lodash";
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { FeatureModel } from '../../core/models/feature.model';
import { UserList } from '../../core/models/user.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { ExportService } from '../../core/services/common/export.service';
import { FetchResult, Inventory } from '../inventory/inventory';
import { RoleModel } from '../../core/models/role.model';

@Component({
  selector: 'ceirpanel-group-role-list-advanced',
  template: `
  <div class="card m-0 p-0" style="overflow: hidden;">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-6" style="margin-top: 5px;">
          <h4 class="card-title">{{ "groupFeature.pageTitle.list" | translate }}</h4>
        </div>
        <div class="clr-col-6 m-0 p-0">
          <div class="btn-group btn-primary float-end">
            <ng-template [ngxPermissionsOnly]="['GROUP-ROLE_DELETE']" [ngxPermissionsOnlyThen]="showDelete"></ng-template>
            <ng-template #showDelete>
              <clr-toggle-container class="clr-toggle-right m-0 p-0 mt-1">
                <clr-toggle-wrapper>
                  <label>{{ "button.multiSelect" | translate }}</label>
                  <input type="checkbox" clrToggle (change)="changeView($event)"/>
                </clr-toggle-wrapper>O
              </clr-toggle-container>
              <button class="btn btn-outline mx-1" aria-label="Check" [disabled]="!multiselect" (click)="confirmation(selecton)">
                <cds-icon shape="trash" solid="true" status="danger" badge="danger"></cds-icon>
              </button>
            </ng-template>
            <span *ngIf="showinfo">
              <ng-template [ngxPermissionsOnly]="['GROUP-ROLE_ADD']" [ngxPermissionsOnlyThen]="showAdd"></ng-template>
              <ng-template #showAdd>
                <button class="btn" aria-label="Check" [routerLink]="['/group-role/edit',groupId]">
                <cds-icon shape="plus" solid="true"status="neutral"></cds-icon> {{ "groupRole.pageTitle.add" | translate }}
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
          <clr-dg-column>{{ "datalist.roleName" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.description" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.action" | translate }}</clr-dg-column>
          <clr-dg-row *ngFor="let gf of usergroups; let i = index;" [clrDgItem]="gf">
            <clr-dg-cell>{{gf.createdOn|date:'yyyy-MM-dd'}}</clr-dg-cell>
            <clr-dg-cell>{{gf.roleName}}</clr-dg-cell>
            <clr-dg-cell>{{gf.description}}</clr-dg-cell>
            <clr-dg-cell>
              <clr-dropdown [clrCloseMenuOnItemClick]="false">
                <button clrDropdownTrigger aria-label="Dropdown demo button" class="m-0 p-0">
                  <cds-icon shape="ellipsis-vertical"></cds-icon>
                </button>
                <clr-dropdown-menu *clrIfOpen [clrPosition]="'bottom-right'">
                  <ng-template [ngxPermissionsOnly]="['USER-GROUP_VIEW']" [ngxPermissionsOnlyThen]="showView" [ngxPermissionsOnlyElse]="hideView"></ng-template>
                  <ng-template #showView>
                    <button class="action-item" [routerLink]="['/group-role/view',groupId]" clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideView>
                    <button class="action-item" [routerLink]="['/group-role/view',groupId]" disabled clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['USER-GROUP_EDIT']" [ngxPermissionsOnlyThen]="showEdit" [ngxPermissionsOnlyElse]="hideEdit"></ng-template>
                  <ng-template #showEdit>
                    <button class="action-item" [routerLink]="['/group-role/edit',groupId]" clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideEdit>
                    <button class="action-item" [routerLink]="['/group-role/edit',groupId]" disabled clrDropdownItem>
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
            <clr-dg-pagination #pagination [clrDgPageSize]="5" [clrDgTotalItems]="total">
              <clr-dg-page-size [clrPageSizeOptions]="[5,10,15,20]"><span class="text-capitalize">{{ "footer.userGroups"| translate }}</span> {{ "footer.perPage"| translate }}</clr-dg-page-size>
              {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}}
              {{ "footer.of"| translate }} {{pagination.totalItems}} {{ "footer.userGroups"| translate }}
            </clr-dg-pagination>
          </clr-dg-footer>
        </clr-datagrid>
  </div>
  <ceirpanel-group-role-delete [open]="open" (confirmation)="openClose($event)" [groups]="selectedData" *ngIf="selectedData.length > 0"></ceirpanel-group-role-delete>
  `,
  styles: [`.dropdown-toggle::after{display:none}`],
})
export class GroupRoleListAdvancedComponent extends ExtendableListComponent {
  public usergroups!: RoleModel[];
  public total!: number;
  public loading = true;
  public selected: any[] = [];
  showinfo = true;
  groupId = 0;
  @ViewChild('pager') pager!: ClrDatagridPagination;
  roles:RoleModel[] = [];
  constructor(
    private inventory: Inventory,
    private cdRef: ChangeDetectorRef,
    private apicall: ApiUtilService,
    public exportService: ExportService,
    route: ActivatedRoute) {
    super();
    route.params.subscribe(param => {
        this.groupId = param['groupId'] || 0;
        console.log('child group id: ', this.groupId);
        if(this.state){
          this.refresh(this.state);
        }
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
    this.applyFilter({group: this.groupId});
    this.apicall.post('/group/pagination', {page:{from:0,to:9,size:10,current:1},filters: this.state.filters}).subscribe({
      next: (result) => {
        this.roles = (result as UserList).content[0].roles;
        this.inventory.reset();
        this.inventory.all =  (result as UserList).content[0].roles;
        this.inventory.sort(state.sort as { by: string; reverse: boolean })
        .fetch(state.page && state.page.from, state.page && state.page.size)
        .then((result: FetchResult) => {
          this.usergroups = result.users;
          this.total = result.length;
          this.loading = false;
          this.cdRef.detectChanges();
        });
      }
    });
  }
  openClose(open: boolean) {
    this.open = open;
    if (open && this.selectedData.length > 0){
      console.log(this.selectedData);
      const roles = _.difference(_.map(this.roles,'id'), _.map(this.selectedData,'id')); 
      this.deleteRecord({groupId: this.groupId, roles});
    }
  }
  deleteRecord(data: any) {
    this.apicall.put(`/groupRole/update/${this.groupId}`, data).subscribe({
        next: (result) => {
            this.selectedData = [];
            this.selecton = null;
            this.refresh(this.state);
        }
    });
  }
}
