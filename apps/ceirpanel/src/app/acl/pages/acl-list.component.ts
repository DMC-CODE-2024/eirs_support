/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { AclList, AclModel } from '../../core/models/acl.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { DeviceService } from '../../core/services/device.service';
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { ExportService } from '../../core/services/common/export.service';
import * as _ from "lodash";
import { AclDeleteComponent } from '../component/acl-delete.component';
import { AclService } from '../services/acl.service';
import { take } from 'rxjs';

@Component({
  selector: 'ceirpanel-acl-list',
  template: `
  <div class="card" style="min-height: 85vh;">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-5" style="margin-top: 5px;">
          <h4 class="card-title">{{ "acl.pageTitle.list" | translate }}</h4>
        </div>
        <div class="clr-col-7 m-0 p-0">
          <div class="btn-group btn-primary float-end">
            <ng-template [ngxPermissionsOnly]="['ACL_DELETE']" [ngxPermissionsOnlyThen]="showDelete"></ng-template>
            <ng-template #showDelete>
              <clr-toggle-container class="clr-toggle-right m-0 p-0 mt-1">
                <clr-toggle-wrapper>
                  <label>{{ "button.multiSelect" | translate }}</label>
                  <input type="checkbox" clrToggle (change)="changeView($event)"/>
                </clr-toggle-wrapper>
              </clr-toggle-container>
              <button class="btn btn-outline mx-1" aria-label="Check" [disabled]="!multiselect" (click)="openDeleteModel(selecton)">
                {{ "acl.pageTitle.delete" | translate }}
              </button>
            </ng-template>
            <ng-template [ngxPermissionsOnly]="['ACL_ADD']" [ngxPermissionsOnlyThen]="showAdd"></ng-template>
            <ng-template #showAdd>
              <button class="btn" aria-label="Check" [routerLink]="['add','']">
                <cds-icon shape="plus" solid="true" inverse="true"></cds-icon> {{ "acl.pageTitle.add" | translate }}
              </button>
            </ng-template>
          </div>  
        </div>
      </div>
    </div>
    <div class="card-block">
      <ng-template [ngxPermissionsOnly]="['ACL_FILTER']" [ngxPermissionsOnlyThen]="showFilter"></ng-template>
      <ng-template #showFilter>
        <ceirpanel-filter (filter)="applyFilter($event);refresh(state)" [startDate]="true" [endDate]="true" [featureName]="true" [roleName]="true"></ceirpanel-filter>
      </ng-template>
      <clr-datagrid class="datagrid-compact" (clrDgRefresh)="refresh($event)" [clrDgLoading]="loading"
          [(clrDgSelected)]="selecton">
          <clr-dg-action-bar>
            <ceirpanel-list-action [state]="state" (download)="export($event)" (refresh)="refresh($event)"
            (filter)="callFilter()" (resetFilter)="resetFilter()" [feature]="'ACL'"></ceirpanel-list-action>
          </clr-dg-action-bar>
          <clr-dg-column [clrDgSortBy]="'createdOn'">{{ "datalist.createDate" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'roleName'">{{ "datalist.roleName" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'featureName'">{{ "datalist.featureName" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'status'">{{ "datalist.status" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.action" | translate }}</clr-dg-column>
          <clr-dg-row *ngFor="let acl of acls; let i = index;" [clrDgItem]="acl">
            <clr-dg-cell>{{acl.createdOn|date:'yyyy-MM-dd'}}</clr-dg-cell>
            <clr-dg-cell>{{acl?.role?.roleName}}</clr-dg-cell>
            <clr-dg-cell>{{acl?.feature?.featureName}}</clr-dg-cell>
            <clr-dg-cell><ceirpanel-status [status]="acl.status"></ceirpanel-status></clr-dg-cell>
            <clr-dg-cell>
              <clr-dropdown [clrCloseMenuOnItemClick]="false">
                <button clrDropdownTrigger aria-label="Dropdown demo button" class="m-0 p-0">
                  <cds-icon shape="ellipsis-vertical"></cds-icon>
                </button>
                <clr-dropdown-menu *clrIfOpen [clrPosition]="'bottom-right'">
                  <ng-template [ngxPermissionsOnly]="['ACL_VIEW']" [ngxPermissionsOnlyThen]="showView" [ngxPermissionsOnlyElse]="hideView"></ng-template>
                  <ng-template #showView>
                    <button class="action-item" [routerLink]="['view',acl.id]"  clrDropdownItem 
                    [queryParams]="{roleId:acl.id.roleId,feaureId:acl.id.featureId,moduleId:acl.id.moduleId}">
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideView>
                    <button class="action-item" [routerLink]="['view',acl.id]" disabled clrDropdownItem 
                    [queryParams]="{roleId:acl.id.roleId,feaureId:acl.id.featureId,moduleId:acl.id.moduleId}">
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['ACL_EDIT']" [ngxPermissionsOnlyThen]="showEdit" [ngxPermissionsOnlyElse]="hideEdit"></ng-template>
                  <ng-template #showEdit>
                    <button class="action-item" [routerLink]="['edit']" clrDropdownItem 
                    [queryParams]="{roleId:acl.id.roleId,feaureId:acl.id.featureId,moduleId:acl.id.moduleId}">
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideEdit>
                    <button class="action-item" [routerLink]="['edit']"
                      [queryParams]="{roleId:acl.id.roleId,feaureId:acl.id.featureId,moduleId:acl.id.moduleId}" disabled clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['ACL_DELETE']" [ngxPermissionsOnlyThen]="showDelete" [ngxPermissionsOnlyElse]="hideDelete"></ng-template>
                  <ng-template #showDelete>
                    <div *ngIf="acl?.status!=='21' && acl?.status!=='0'; then delete else active"></div>
                    <ng-template #delete>
                      <button class="action-item" (click)="openDeleteModel(acl)" clrDropdownItem>
                        <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                      </button>
                    </ng-template>
                    <ng-template #active>
                      <button class="action-item" (click)="openDeleteModel(acl)" clrDropdownItem>
                        <cds-icon shape="plus"></cds-icon> {{ "button.active"| translate }}
                      </button>
                    </ng-template>
                  </ng-template>
                  <ng-template #hideDelete>
                    <button class="action-item" (click)="openDeleteModel(acl)" disabled clrDropdownItem>
                      <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                    </button>
                  </ng-template>    
                </clr-dropdown-menu>
              </clr-dropdown>
            </clr-dg-cell>
          </clr-dg-row>
          <!--clr-dg-detail *clrIfDetail="let detail">
            <clr-dg-detail-body class="m-0 p-0">
              <clr-stack-view>
                <clr-stack-block *ngFor="let m of detail.featureModules;let i = index" [clrStackViewLevel]="i">
                  <clr-stack-label>{{m?.feature.featureName}}</clr-stack-label>
                  <clr-stack-content>{{m?.feature?.modules.length}}</clr-stack-content>
                  <clr-stack-block *ngFor="let module of m.feature.modules;let it = index" [clrStackViewLevel]="it" class="m-0 p-0">
                    <clr-stack-label>{{module?.moduleName}}</clr-stack-label>
                    <clr-stack-content>{{module?.moduleTag?.moduleTagName}}</clr-stack-content>
                  </clr-stack-block>
                </clr-stack-block>
              </clr-stack-view>
            </clr-dg-detail-body>
          </clr-dg-detail-->
          <clr-dg-footer>
            <clr-dg-pagination #pagination [clrDgPageSize]="10" [clrDgTotalItems]="total">
              <clr-dg-page-size [clrPageSizeOptions]="[10,20,50,100]">Acls per page</clr-dg-page-size>
              {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}}
              of {{pagination.totalItems}} acls
            </clr-dg-pagination>
          </clr-dg-footer>
        </clr-datagrid>
    </div>
  </div>
  <ceirpanel-acl-delete (confirmation)="deleteRecord($event)" (aconfirmation)="activateRecord($event)"></ceirpanel-acl-delete>
  `,
  styles: [`.dropdown-toggle::after{display:none}`],
})
export class AclListComponent extends ExtendableListComponent {
  public acls!: AclModel[];
  public total!: number;
  public loading = true;
  public selected: any[] = [];
  @ViewChild(AclDeleteComponent) deleteUser !: AclDeleteComponent;
  rowSizeForExport!: number;
  constructor(
    private deviceService: DeviceService, 
    private cdRef: ChangeDetectorRef,
     private translate: TranslateService,
     private apicall: ApiUtilService,
     public exportService: ExportService,
     private aclService: AclService) { 
      super();
      this.apicall.get('/config/frontend').subscribe({next: (data:any) => this.rowSizeForExport = data?.rowSizeForExport || 1000});
  }

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.state = state;
    this.cdRef.detectChanges();
    this.applyExisterFilter();
    this.apicall.post('/acl/pagination', state).subscribe({
      next: (result) => {
        this.acls = (result as AclList).content;
        this.total = (result as AclList).totalElements;
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }
  export(state: ClrDatagridStateInterface) {
    const st = _.cloneDeep(state);
    if(st && st.page) st.page.size = this.rowSizeForExport;
    this.apicall.post('/acl/pagination', st).subscribe({
      next: (result) => {
        const modules = (result as AclList).content;
        this.exportService.acl(modules, `${_.now()}-acl`,{showLabels: true,headers: ["Created On", "Role Name","Feature", "Module"]});
      }
    });
  }
  deleteRecord(data: AclModel | Array<AclModel>) {
    this.selectedData = [];
    this.aclService.delete(this.aclService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  activateRecord(data: AclModel | Array<AclModel>) {
    this.selectedData = [];
    this.aclService.activate(this.aclService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  openDeleteModel(data: AclModel | Array<AclModel>) {
    this.deleteUser.group = null!;
    if(_.isArray(data) && data.length > 1){
      this.deleteUser.groups = data;
      this.deleteUser.status = '1';
    } else if(_.isArray(data) && data.length == 1){
      this.deleteUser.group = data[0];
      this.deleteUser.status = data[0].status;
    } else if(!_.isArray(data)){
      this.deleteUser.group = data;
      this.deleteUser.status = data.status;
    }
    this.deleteUser.open = true; 
  }
}
