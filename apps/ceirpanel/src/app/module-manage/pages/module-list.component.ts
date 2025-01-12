/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { ModuleMangeList, ModuleMangeModel } from '../../core/models/module.manage.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { DeviceService } from '../../core/services/device.service';
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { NgxPermissionsService } from 'ngx-permissions';
import * as _ from "lodash";
import { ExportService } from '../../core/services/common/export.service';
import { ModuleDeleteComponent } from '../component/module-delete.component';
import { ModuleService } from '../service/module.service';
import { take } from 'rxjs';

@Component({
  selector: 'ceirpanel-module-list',
  template: `
  <div class="card" style="min-height: 85vh;">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-5" style="margin-top: 5px;">
          <h4 class="card-title">{{ "module.pageTitle.list" | translate }}</h4>
        </div>
        <div class="clr-col-7 m-0 p-0">
          <div class="btn-group btn-primary float-end">
            <ng-template [ngxPermissionsOnly]="['MODULE_DELETE']" [ngxPermissionsOnlyThen]="showDelete"></ng-template>
            <ng-template #showDelete>
              <clr-toggle-container class="clr-toggle-right m-0 p-0 mt-1">
                <clr-toggle-wrapper>
                  <label>{{ "button.multiSelect" | translate }}</label>
                  <input type="checkbox" clrToggle (change)="changeView($event)"/>
                </clr-toggle-wrapper>
              </clr-toggle-container>
              <button class="btn btn-outline mx-1" aria-label="Check" [disabled]="!multiselect" (click)="openDeleteModel(selecton)">
                {{ "module.pageTitle.delete" | translate }}
              </button>
            </ng-template>
            <ng-template [ngxPermissionsOnly]="['MODULE_ADD']" [ngxPermissionsOnlyThen]="showAdd" [ngxPermissionsOnlyElse]="hideAdd"></ng-template>
            <ng-template #showAdd>
              <button class="btn" aria-label="Check" [routerLink]="['add','']">
                <cds-icon shape="plus" solid="true" inverse="true"></cds-icon> {{ "module.pageTitle.add" | translate }}
              </button>
            </ng-template>
            <ng-template #hideAdd>
              <button class="btn" aria-label="Check" [routerLink]="['add','']" disabled>
                <cds-icon shape="plus" solid="true" inverse="true"></cds-icon> {{ "module.pageTitle.add" | translate }}
              </button>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
    <div class="card-block">
      <ng-template [ngxPermissionsOnly]="['MODULE_FILTER']" [ngxPermissionsOnlyThen]="showFilter"></ng-template>
      <ng-template #showFilter>
        <ceirpanel-filter (filter)="applyFilter($event);refresh(state)" [startDate]="true" [endDate]="true" [groupName]="false"
          [parentGroupName]="false" [moduleName]="true"></ceirpanel-filter>
      </ng-template>  
       <clr-datagrid class="datagrid-compact" (clrDgRefresh)="refresh($event)" [clrDgLoading]="loading" [(clrDgSelected)]="selecton">
        <clr-dg-action-bar>
            <ceirpanel-list-action [state]="state" (download)="export($event)" (refresh)="refresh($event)"
            (filter)="callFilter()" (resetFilter)="resetFilter()" [feature]="'MODULE'"></ceirpanel-list-action>
          </clr-dg-action-bar>
          <clr-dg-column [clrDgSortBy]="'createdOn'">{{ "datalist.createDate" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'updatedOn'">{{ "datalist.modifiedDate" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'moduleName'">{{ "datalist.moduleName" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'status'">{{ "datalist.status" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.action" | translate }}</clr-dg-column>
          <clr-dg-row *ngFor="let module of modules; let i = index;" [clrDgItem]="module">
            <clr-dg-cell>{{module.createdOn|date:'yyyy-MM-dd'}}</clr-dg-cell>
            <clr-dg-cell>{{module.updatedOn|date:'yyyy-MM-dd'}}</clr-dg-cell>
            <clr-dg-cell>{{module.moduleName}}</clr-dg-cell>
            <clr-dg-cell><ceirpanel-status [status]="module.status"></ceirpanel-status></clr-dg-cell>
            <clr-dg-cell>
              <clr-dropdown [clrCloseMenuOnItemClick]="false">
                <button clrDropdownTrigger aria-label="Dropdown demo button" class="m-0 p-0">
                  <cds-icon shape="ellipsis-vertical"></cds-icon>
                </button>
                <clr-dropdown-menu *clrIfOpen [clrPosition]="'bottom-right'">
                <ng-template [ngxPermissionsOnly]="['MODULE_VIEW']" [ngxPermissionsOnlyThen]="showView" [ngxPermissionsOnlyElse]="hideView"></ng-template>
                  <ng-template #showView>
                    <button class="action-item" [routerLink]="['view',module.id]" clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideView>
                    <button class="action-item" [routerLink]="['view',module.id]" disabled clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['MODULE_EDIT']" [ngxPermissionsOnlyThen]="showEdit" [ngxPermissionsOnlyElse]="hideEdit"></ng-template>
                  <ng-template #showEdit>
                    <button class="action-item" [routerLink]="['edit',module.id]" clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideEdit>
                    <button class="action-item" [routerLink]="['edit',module.id]" disabled clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['MODULE_DELETE']" [ngxPermissionsOnlyThen]="showDelete" [ngxPermissionsOnlyElse]="hideDelete"></ng-template>
                  <ng-template #showDelete>
                    <div *ngIf="module?.status!=='21' && module?.status !== '0'; then delete else active"></div>
                    <ng-template #delete>
                      <button class="action-item" (click)="openDeleteModel(module)" clrDropdownItem>
                        <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                      </button>
                    </ng-template>
                    <ng-template #active>
                      <button class="action-item" (click)="openDeleteModel(module)" clrDropdownItem>
                        <cds-icon shape="plus"></cds-icon> {{ "button.active"| translate }}
                      </button>
                    </ng-template>
                  </ng-template>
                  <ng-template #hideDelete>
                    <button class="action-item" (click)="confirmation([module])" disabled clrDropdownItem>
                      <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                    </button>
                  </ng-template>
                </clr-dropdown-menu>
              </clr-dropdown>
            </clr-dg-cell>
          </clr-dg-row>
          <clr-dg-footer>
            <clr-dg-pagination #pagination [clrDgPageSize]="10" [clrDgTotalItems]="total">
              <clr-dg-page-size [clrPageSizeOptions]="[10,20,50,100]">Module per page</clr-dg-page-size>
              {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}}
              of {{pagination.totalItems}} modules
            </clr-dg-pagination>
          </clr-dg-footer>
        </clr-datagrid>
    </div>
  </div>
  <ceirpanel-module-delete (confirmation)="deleteRecord($event)" (aconfirmation)="activateRecord($event)"></ceirpanel-module-delete>
  `,
  styles: [`.dropdown-toggle::after{display:none}`],
})
export class ModuleListComponent extends ExtendableListComponent {
  public modules!: ModuleMangeModel[];
  public total!: number;
  public loading = true;
  public selected: any[] = [];
  @ViewChild(ModuleDeleteComponent) deleteUser !: ModuleDeleteComponent;
  rowSizeForExport!: number;
  constructor(
    private deviceService: DeviceService, 
    private cdRef: ChangeDetectorRef, 
    private translate: TranslateService,
    private apicall: ApiUtilService,
    public permission: NgxPermissionsService,
    public exportService: ExportService,
    private moduleService: ModuleService) {
      super();
      this.apicall.get('/config/frontend').subscribe({next: (data:any) => this.rowSizeForExport = data?.rowSizeForExport || 1000});
     }

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.state = state;
    this.cdRef.detectChanges();
    this.applyExisterFilter();
    this.apicall.post('/module/pagination', state).subscribe({
      next: (result) => {
        this.modules = (result as ModuleMangeList).content;
        this.total = (result as ModuleMangeList).totalElements;
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
  deleteRecord(data: ModuleMangeModel | Array<ModuleMangeModel>) {
    this.selectedData = [];
    this.moduleService.delete(this.moduleService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  activateRecord(data: ModuleMangeModel | Array<ModuleMangeModel>) {
    this.selectedData = [];
    this.moduleService.activate(this.moduleService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  
  openDeleteModel(data: ModuleMangeModel | Array<ModuleMangeModel>) {
    this.deleteUser.module = null!;
    if(_.isArray(data) && data.length > 1){
      this.deleteUser.modules = data;
      this.deleteUser.status = '1';
    } else if(_.isArray(data) && data.length == 1){
      this.deleteUser.module = data[0];
      this.deleteUser.status = data[0].status;
    } else if(!_.isArray(data)){
      this.deleteUser.module = data;
      this.deleteUser.status = data.status;
    }
    this.deleteUser.open = true; 
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
    this.apicall.post('/module/pagination', st).subscribe({
      next: (result) => {
        const tags = (result as ModuleMangeList).content;
        this.exportService.modules(tags, `${_.now()}_modules`,{showLabels: true,headers: ["ID", "Created On", "Module Name","Status"]});
      }
    });
  }
}
