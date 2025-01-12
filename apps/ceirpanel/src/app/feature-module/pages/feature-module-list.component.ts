/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import * as _ from "lodash";
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { FeatureList, FeatureModel } from '../../core/models/feature.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { ExportService } from '../../core/services/common/export.service';
import { DeviceService } from '../../core/services/device.service';
import { FeatureModuleDto } from '../dto/feature.module.dto';
import { FeatureModuleService } from '../service/feature.module.service';
import { take } from 'rxjs';
import { FeatureModuleDeleteComponent } from '../component/feature-module-delete.component';

@Component({
  selector: 'ceirpanel-feature-module-list',
  template: `
  <div class="card" style="min-height: 85vh;">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-4" style="margin-top: 5px;">
          <h4 class="card-title">{{ "featureModule.pageTitle.list" | translate }}</h4>
        </div>
        <div class="clr-col-8 m-0 p-0">
          <div class="btn-group btn-primary float-end">
            <ng-template [ngxPermissionsOnly]="['FEATURE-MODULE_DELETE']" [ngxPermissionsOnlyThen]="showDelete"></ng-template>
            <ng-template #showDelete>
              <clr-toggle-container class="clr-toggle-right m-0 p-0 mt-1">
                <clr-toggle-wrapper>
                  <label>{{ "button.multiSelect" | translate }}</label>
                  <input type="checkbox" clrToggle (change)="changeView($event)"/>
                </clr-toggle-wrapper>
              </clr-toggle-container>
              <button class="btn btn-outline mx-1" aria-label="Check" [disabled]="!multiselect" (click)="openDeleteModel(selecton)">
                {{ "featureModule.pageTitle.delete" | translate }}
              </button>
            </ng-template>
            <ng-template [ngxPermissionsOnly]="['FEATURE-MODULE_ADD']" [ngxPermissionsOnlyThen]="showAdd"></ng-template>
            <ng-template #showAdd>
              <button class="btn" aria-label="Check" [routerLink]="['add','']">
                <cds-icon shape="plus" solid="true" inverse="true"></cds-icon> {{ "featureModule.pageTitle.add" | translate }}
              </button>
            </ng-template>
          </div>    
        </div>
      </div>
    </div>
    <div class="card-block">
      <ng-template [ngxPermissionsOnly]="['FEATURE-MODULE_FILTER']" [ngxPermissionsOnlyThen]="showFilter"></ng-template>
      <ng-template #showFilter>
        <ceirpanel-filter (filter)="applyFilter($event);refresh(state)" [startDate]="true" [endDate]="true" [featureName]="true" [moduleName]="true"></ceirpanel-filter>
      </ng-template>
      <clr-datagrid class="datagrid-compact" (clrDgRefresh)="refresh($event)" [clrDgLoading]="loading"
          [(clrDgSelected)]="selecton">
          <clr-dg-action-bar>
            <ceirpanel-list-action [state]="state" (download)="export($event)" (refresh)="refresh($event)"
            (filter)="callFilter()" (resetFilter)="resetFilter()" [feature]="'FEATURE-MODULE'"></ceirpanel-list-action>
          </clr-dg-action-bar>
          <clr-dg-column [clrDgSortBy]="'createdOn'">{{ "datalist.createDate" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'featureName'">{{ "datalist.featureName" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'moduleName'">{{ "datalist.moduleName" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'status'">{{ "datalist.status" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.action" | translate }}</clr-dg-column>
          <clr-dg-row *ngFor="let gf of list?.content; let i = index;" [clrDgItem]="gf">
            <clr-dg-cell>{{gf.createdOn|date:'yyyy-MM-dd'}}</clr-dg-cell>
            <clr-dg-cell>{{gf?.feature?.featureName}}</clr-dg-cell>
            <clr-dg-cell>{{gf?.module?.moduleName}}</clr-dg-cell>
            <clr-dg-cell>
              <span *ngIf="!gf?.status ||gf?.status==='0'" class="badge badge-info">{{ "status.inactive"| translate }}</span>
              <span *ngIf="gf?.status==='3'" class="badge badge-success">{{ "status.active"| translate }}</span>
              <span *ngIf="gf?.status==='4'" class="badge badge-warning">{{ "status.suspended"| translate }}</span>
              <span *ngIf="gf?.status==='5'" class="badge">{{ "status.locked"| translate }}</span>
              <span *ngIf="gf?.status==='21'" class="badge badge-danger">{{ "status.deleted"| translate }}</span>
            </clr-dg-cell>
            <clr-dg-cell>
              <clr-dropdown [clrCloseMenuOnItemClick]="false">
                <button clrDropdownTrigger aria-label="Dropdown demo button" class="m-0 p-0">
                  <cds-icon shape="ellipsis-vertical"></cds-icon>
                </button>
                <clr-dropdown-menu *clrIfOpen [clrPosition]="'bottom-right'">
                  <ng-template [ngxPermissionsOnly]="['FEATURE-MODULE_VIEW']" [ngxPermissionsOnlyThen]="showView" [ngxPermissionsOnlyElse]="hideView"></ng-template>
                  <ng-template #showView>
                    <button class="action-item" [routerLink]="['view',gf?.id?.featureId]" clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideView>
                    <button class="action-item" [routerLink]="['view',gf?.id?.featureId]" disabled clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['FEATURE-MODULE_EDIT']" [ngxPermissionsOnlyThen]="showEdit" [ngxPermissionsOnlyElse]="hideEdit"></ng-template>
                  <ng-template #showEdit>
                    <button class="action-item" [routerLink]="['edit',gf?.id?.featureId]" clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideEdit>
                    <button class="action-item" [routerLink]="['edit',gf?.id?.featureId]" disabled clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['FEATURE-MODULE_DELETE']" [ngxPermissionsOnlyThen]="showDelete" [ngxPermissionsOnlyElse]="hideDelete"></ng-template>
                  <ng-template #showDelete>
                  <div *ngIf="gf?.status!=='21' && gf?.status !== '0'; then delete else active"></div>
                    <ng-template #delete>
                      <button class="action-item" (click)="openDeleteModel(gf)" clrDropdownItem>
                        <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                      </button>
                    </ng-template>
                    <ng-template #active>
                      <button class="action-item" (click)="openDeleteModel(gf)" clrDropdownItem>
                        <cds-icon shape="plus"></cds-icon> {{ "button.active"| translate }}
                      </button>
                    </ng-template>
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
              <clr-dg-pagination #pagination [clrDgPageSize]="10" [clrDgTotalItems]="list.totalElements || 0">
                <clr-dg-page-size [clrPageSizeOptions]="[10,20,50,100]">
                  <span class="text-capitalize">Feature Module</span> per page
                </clr-dg-page-size>
                {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}}
                of {{pagination.totalItems}} Feature Modules
              </clr-dg-pagination>
            </clr-dg-footer>
        </clr-datagrid>
    </div>
  </div>
  <ceirpanel-feature-module-delete (confirmation)="deleteRecord($event)" (aconfirmation)="activateRecord($event)"></ceirpanel-feature-module-delete>
  `,
  styles: [`.dropdown-toggle::after{display:none}`],
})
export class FeatureModuleListComponent extends ExtendableListComponent {
  public groupfeatures!: FeatureModel[];
  public total!: number;
  public loading = true;
  public selected: any[] = [];
  list: FeatureModuleDto = {totalElements: 0} as FeatureModuleDto;
  @ViewChild(FeatureModuleDeleteComponent) userGroupDelete!: FeatureModuleDeleteComponent;
  rowSizeForExport!:number;
  constructor(
    private deviceService: DeviceService, 
    private cdRef: ChangeDetectorRef,
     private translate: TranslateService,
     private apicall: ApiUtilService,
     public exportService: ExportService,
     private featureModuleService: FeatureModuleService,
     ) { 
      super();
      this.apicall.get('/config/frontend').subscribe({next: (data:any) => this.rowSizeForExport = data?.rowSizeForExport || 1000});
  }

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.state = state;
    this.cdRef.detectChanges();
    this.applyExisterFilter();
    this.featureModuleService.pagination(state).subscribe({
      next: (users: FeatureModuleDto) => {
        this.list = users;
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }
  deleteRecord(data: FeatureModuleDto | Array<FeatureModuleDto>) {
    this.selectedData = [];
    this.featureModuleService.delete(this.featureModuleService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  activateRecord(data: FeatureModuleDto | Array<FeatureModuleDto>) {
    this.selectedData = [];
    this.featureModuleService.activate(this.featureModuleService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  
  openDeleteModel(data: FeatureModuleDto | Array<FeatureModuleDto>) {
    this.userGroupDelete.userGroup = null!;
    if(_.isArray(data) && data.length > 1){
      this.userGroupDelete.userGroups = data;
      this.userGroupDelete.status = '1';
    } else if(_.isArray(data) && data.length == 1){
      this.userGroupDelete.userGroup = data[0];
      this.userGroupDelete.status = data[0].status;
    } else if(!_.isArray(data)){
      this.userGroupDelete.userGroup = data;
      this.userGroupDelete.status = data.status;
    }
    this.userGroupDelete.open = true; 
  }
  export(state: ClrDatagridStateInterface) {
    const st = _.cloneDeep(state);
    if(st && st.page) st.page.size = this.rowSizeForExport;
    this.featureModuleService.pagination(st).subscribe({
      next: (feature: FeatureModuleDto) => {
        const modules = feature.content;
        this.exportService.featureModules(modules, `${_.now()}_feature-modules`,{showLabels: true,headers: ["Created On", "Feature Name","Module Name", "Status"]});
      }
    });
  }
}
