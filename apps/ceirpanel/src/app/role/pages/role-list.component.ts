/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import * as _ from "lodash";
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { RoleList, RoleModel } from '../../core/models/role.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { ExportService } from '../../core/services/common/export.service';
import { DeviceService } from '../../core/services/device.service';
import { RoleDeleteComponent } from '../component/role-delete.component';
import { RoleService } from '../service/role.service';
import { lastValueFrom, take } from 'rxjs';
@Component({
  selector: 'ceirpanel-role-list',
  template: `
  <div class="card" style="min-height: 85vh;">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-5" style="margin-top: 5px;">
          <h4 class="card-title">{{ "role.pageTitle.list" | translate }}</h4>
        </div>
        <div class="clr-col-7 m-0 p-0">
          <div class="btn-group btn-primary float-end">
            <ng-template [ngxPermissionsOnly]="['ROLE_DELETE']" [ngxPermissionsOnlyThen]="showDelete"></ng-template>
            <ng-template #showDelete>
              <clr-toggle-container class="clr-toggle-right m-0 p-0 mt-1">
                <clr-toggle-wrapper>
                  <label>{{ "button.multiSelect" | translate }}</label>
                  <input type="checkbox" clrToggle (change)="changeView($event)"/>
                </clr-toggle-wrapper>
              </clr-toggle-container>
              <button class="btn btn-outline mx-1" aria-label="Check" [disabled]="!multiselect" (click)="openDeleteModel(selecton)">
                {{ "role.pageTitle.delete" | translate }}
              </button>
            </ng-template>
            <ng-template [ngxPermissionsOnly]="['ROLE_ADD']" [ngxPermissionsOnlyThen]="showAdd"></ng-template>
            <ng-template #showAdd>
              <button class="btn" aria-label="Check" [routerLink]="['add','']">
                <cds-icon shape="plus" solid="true" inverse="true"></cds-icon> {{ "role.pageTitle.add" | translate }}
              </button>
            </ng-template>
          </div>  
        </div>
      </div>
    </div>
    <div class="card-block">
      <ng-template [ngxPermissionsOnly]="['ROLE_FILTER']" [ngxPermissionsOnlyThen]="showFilter"></ng-template>
      <ng-template #showFilter>
        <ceirpanel-filter (filter)="applyFilter($event);refresh(state)" [startDate]="true" [endDate]="true" [roleName]="true"></ceirpanel-filter>
      </ng-template>
      <clr-datagrid class="datagrid-compact" (clrDgRefresh)="refresh($event)" [clrDgLoading]="loading"
          [(clrDgSelected)]="selecton">
          <clr-dg-action-bar>
            <ceirpanel-list-action [state]="state" (download)="export($event)" (refresh)="refresh($event)"
            (filter)="callFilter()" (resetFilter)="resetFilter()" [feature]="'ROLE'"></ceirpanel-list-action>
          </clr-dg-action-bar>
          <clr-dg-column [clrDgSortBy]="'createdOn'">{{ "datalist.createDate" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'roleName'">{{ "datalist.roleName" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.access" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'status'">{{ "datalist.status" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.action" | translate }}</clr-dg-column>
          <clr-dg-row *ngFor="let role of roles; let i = index;" [clrDgItem]="role">
            <clr-dg-cell>{{role.createdOn|date:'yyyy-MM-dd'}}</clr-dg-cell>
            <clr-dg-cell>{{role.roleName}}</clr-dg-cell>
            <clr-dg-cell>{{role.access}}</clr-dg-cell>
            <clr-dg-cell><ceirpanel-status [status]="role.status"></ceirpanel-status></clr-dg-cell>
            <clr-dg-cell>
              <clr-dropdown [clrCloseMenuOnItemClick]="false">
                <button clrDropdownTrigger aria-label="Dropdown demo button" class="m-0 p-0">
                  <cds-icon shape="ellipsis-vertical"></cds-icon>
                </button>
                <clr-dropdown-menu *clrIfOpen [clrPosition]="'bottom-right'">
                  <ng-template [ngxPermissionsOnly]="['ROLE_VIEW']" [ngxPermissionsOnlyThen]="showView" [ngxPermissionsOnlyElse]="hideView"></ng-template>
                  <ng-template #showView>
                    <button class="action-item" [routerLink]="['view',role.id]" clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideView>
                    <button class="action-item" [routerLink]="['view',role.id]" disabled clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['ROLE_EDIT']" [ngxPermissionsOnlyThen]="showEdit" [ngxPermissionsOnlyElse]="hideEdit"></ng-template>
                  <ng-template #showEdit>
                    <button class="action-item" [routerLink]="['edit',role.id]" clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideEdit>
                    <button class="action-item" [routerLink]="['edit',role.id]" disabled clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['ROLE_DELETE']" [ngxPermissionsOnlyThen]="showDelete" [ngxPermissionsOnlyElse]="hideDelete"></ng-template>
                  <ng-template #showDelete>
                    <div *ngIf="role?.status!=='21' && role?.status !== '0'; then delete else active"></div>
                    <ng-template #delete>
                      <button class="action-item" (click)="openDeleteModel(role)" clrDropdownItem>
                        <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                      </button>
                    </ng-template>
                    <ng-template #active>
                      <button class="action-item" (click)="openDeleteModel(role)" clrDropdownItem>
                        <cds-icon shape="plus"></cds-icon> {{ "button.active"| translate }}
                      </button>
                    </ng-template>
                  </ng-template>
                  <ng-template #hideDelete>
                    <button class="action-item" (click)="confirmation([role])" disabled clrDropdownItem>
                      <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                    </button>
                  </ng-template>  
                </clr-dropdown-menu>
              </clr-dropdown>
            </clr-dg-cell>
          </clr-dg-row>
          <clr-dg-footer>
            <clr-dg-pagination #pagination [clrDgPageSize]="10" [clrDgTotalItems]="total">
              <clr-dg-page-size [clrPageSizeOptions]="[10,20,50,100]"><span class="text-capitalize">{{ "footer.roles"| translate }}</span> {{ "footer.perPage"| translate }}</clr-dg-page-size>
              {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}}
              {{ "footer.of"| translate }} {{pagination.totalItems}} {{ "footer.roles"| translate }}
            </clr-dg-pagination>
          </clr-dg-footer>
        </clr-datagrid>
    </div>
  </div>
  <ceirpanel-role-delete (confirmation)="deleteRecord($event)" (aconfirmation)="activateRecord($event)"></ceirpanel-role-delete>
  `,
  styles: [`.dropdown-toggle::after{display:none}`],
})
export class RoleListComponent extends ExtendableListComponent{
  public roles!: RoleModel[];
  public total!: number;
  public loading = true;
  public selected: any[] = [];
  @ViewChild(RoleDeleteComponent) deleteUser !: RoleDeleteComponent;
  rowSizeForExport!: number;
  constructor(
    private deviceService: DeviceService, 
    private cdRef: ChangeDetectorRef,
     private translate: TranslateService,
     private apicall: ApiUtilService,
     public exportService: ExportService,
     private roleService: RoleService) { 
      super();
      this.apicall.get('/config/frontend').subscribe({next: (data:any) => this.rowSizeForExport = data?.rowSizeForExport || 1000});
     }

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.state = state;
    this.cdRef.detectChanges();
    this.apicall.post('/role/pagination', state).subscribe({
      next: (result) => {
        this.roles = (result as RoleList).content;
        this.total = (result as RoleList).totalElements;
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }
  deleteRecord(data: RoleModel | Array<RoleModel>) {
    this.selectedData = [];
    this.roleService.delete(this.roleService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  activateRecord(data: RoleModel | Array<RoleModel>) {
    this.selectedData = [];
    this.roleService.activate(this.roleService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  
  openDeleteModel(data: RoleModel | Array<RoleModel>) {
    this.deleteUser.role = null!;
    if(_.isArray(data) && data.length > 1){
      this.deleteUser.status = '1';
      this.deleteUser.roles = data;
    } else if(_.isArray(data) && data.length == 1){
      this.deleteUser.role = data[0];
      this.deleteUser.status = data[0].status;
    } else if(!_.isArray(data)){
      this.deleteUser.role = data;
      this.deleteUser.status = data.status;
    }
    this.deleteUser.open = true; 
  }
  export(state: ClrDatagridStateInterface) {
    const st = _.cloneDeep(state);
    if(st && st.page) st.page.size = this.rowSizeForExport;
    this.apicall.post('/role/pagination', st).subscribe({
      next: async (result) => {
        const modules = (result as RoleList).content;
        this.exportService.roles(modules, `${_.now()}-roles`,{showLabels: true,headers: [
          await lastValueFrom(this.translate.get('datalist.createDate')),
          await lastValueFrom(this.translate.get('datalist.roleName')),
          await lastValueFrom(this.translate.get('datalist.access')),
          await lastValueFrom(this.translate.get('datalist.status'))
        ]});
      }
    });
  }
}
