/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { FeatureList, FeatureModel } from '../../core/models/feature.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { DeviceService } from '../../core/services/device.service';
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { NgxPermissionsService } from 'ngx-permissions';
import * as _ from "lodash";
import { ExportService } from '../../core/services/common/export.service';
import { UploadService } from '../../core/services/common/upload.service';
import { FeatureService } from '../service/feature.service';
import { take } from 'rxjs';
import { FeatureDeleteComponent } from '../component/feature-delete.component';

@Component({
  selector: 'ceirpanel-feature-list',
  template: `
  <div class="card" style="min-height: 85vh;">
    <div class="card-header">
    <div class="clr-row clr-justify-content-between">
      <div class="clr-col-6" style="margin-top: 5px;">
        <h4 class="card-title">{{ "feature.pageTitle.list" | translate }}</h4>
      </div>
      <div class="clr-col-6 m-0 p-0">
        <div class="btn-group btn-primary float-end">
          <ng-template [ngxPermissionsOnly]="['FEATURE_DELETE']" [ngxPermissionsOnlyThen]="showDelete"></ng-template>
          <ng-template #showDelete>
            <clr-toggle-container class="clr-toggle-right m-0 p-0 mt-1">
              <clr-toggle-wrapper>
                <label>{{ "button.multiSelect" | translate }}</label>
                <input type="checkbox" clrToggle (change)="changeView($event)"/>
              </clr-toggle-wrapper>
            </clr-toggle-container>
            <button class="btn btn-outline mx-1" aria-label="Check" [disabled]="!multiselect" (click)="openDeleteModel(selecton)">
              {{ "feature.pageTitle.delete" | translate }}
            </button>
          </ng-template>
          <ng-template [ngxPermissionsOnly]="['FEATURE_ADD']" [ngxPermissionsOnlyThen]="showAdd"></ng-template>
          <ng-template #showAdd>
            <button class="btn" aria-label="Check" [routerLink]="['add','']">
              <cds-icon shape="plus" solid="true" inverse="true"></cds-icon> {{ "feature.pageTitle.add" | translate }}
            </button>
          </ng-template>
        </div>  
      </div>
      </div>
    </div>
    <div class="card-block">
      <ng-template [ngxPermissionsOnly]="['FEATURE_FILTER']" [ngxPermissionsOnlyThen]="showFilter"></ng-template>
      <ng-template #showFilter>
        <ceirpanel-filter (filter)="applyFilter($event);refresh(state)" [startDate]="true" [endDate]="true" [featureName]="true"></ceirpanel-filter>
      </ng-template>
      <clr-datagrid class="datagrid-compact" (clrDgRefresh)="refresh($event)" [clrDgLoading]="loading"
          [(clrDgSelected)]="selecton">
          <clr-dg-action-bar>
            <ceirpanel-list-action [state]="state" (download)="export($event)" (refresh)="refresh($event)"
            (filter)="callFilter()" (resetFilter)="resetFilter()" [feature]="'FEATURE'"></ceirpanel-list-action>
          </clr-dg-action-bar>
          <clr-dg-column [clrDgSortBy]="'createdOn'">{{ "datalist.createDate" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'featureName'">{{ "datalist.featureName" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.category" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'status'">{{ "datalist.status" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.action" | translate }}</clr-dg-column>
          <clr-dg-row *ngFor="let feature of features; let i = index;" [clrDgItem]="feature">
            <clr-dg-cell>{{feature.createdOn|date:'yyyy-MM-dd'}}</clr-dg-cell>
            <clr-dg-cell>{{feature.featureName}}</clr-dg-cell>
            <clr-dg-cell>{{feature.category}}</clr-dg-cell>
            <clr-dg-cell><ceirpanel-status [status]="feature.status"></ceirpanel-status></clr-dg-cell>

            <clr-dg-cell>
              <clr-dropdown [clrCloseMenuOnItemClick]="false">
                <button clrDropdownTrigger aria-label="Dropdown demo button" class="m-0 p-0">
                  <cds-icon shape="ellipsis-vertical"></cds-icon>
                </button>
                <clr-dropdown-menu *clrIfOpen [clrPosition]="'bottom-right'">
                  <ng-template [ngxPermissionsOnly]="['FEATURE_VIEW']" [ngxPermissionsOnlyThen]="showView" [ngxPermissionsOnlyElse]="hideView"></ng-template>
                  <ng-template #showView>
                    <button class="action-item" [routerLink]="['view',feature.id]" clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideView>
                    <button class="action-item" [routerLink]="['view',feature.id]" disabled clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['FEATURE_EDIT']" [ngxPermissionsOnlyThen]="showEdit" [ngxPermissionsOnlyElse]="hideEdit"></ng-template>
                  <ng-template #showEdit>
                    <button class="action-item" [routerLink]="['edit',feature.id]" clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideEdit>
                    <button class="action-item" [routerLink]="['edit',feature.id]" disabled clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['FEATURE_DELETE']" [ngxPermissionsOnlyThen]="showDelete" [ngxPermissionsOnlyElse]="hideDelete"></ng-template>
                  <ng-template #showDelete>
                    <div *ngIf="feature?.status!=='21' && feature?.status!=='0'; then delete else active"></div>
                    <ng-template #delete>
                      <button class="action-item" (click)="openDeleteModel(feature)" clrDropdownItem>
                        <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                      </button>
                    </ng-template>
                    <ng-template #active>
                      <button class="action-item" (click)="openDeleteModel(feature)" clrDropdownItem>
                        <cds-icon shape="plus"></cds-icon> {{ "button.active"| translate }}
                      </button>
                    </ng-template>
                  </ng-template>
                  <ng-template #hideDelete>
                    <button class="action-item" (click)="confirmation([feature])" disabled clrDropdownItem>
                      <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                    </button>
                  </ng-template>
                </clr-dropdown-menu>
              </clr-dropdown>
            </clr-dg-cell>
          </clr-dg-row>
          <clr-dg-footer>
            <clr-dg-pagination #pagination [clrDgPageSize]="10" [clrDgTotalItems]="total">
              <clr-dg-page-size [clrPageSizeOptions]="[10,20,50,100]">
                <span class="text-capitalize">{{ "footer.features"| translate }}</span> {{ "footer.perPage"| translate }}
              </clr-dg-page-size>
              {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}}
              {{ "footer.of"| translate }} {{pagination.totalItems}} {{ "footer.features"| translate }}
            </clr-dg-pagination>
          </clr-dg-footer>
        </clr-datagrid>
    </div>
  </div>
  <ceirpanel-feature-delete (confirmation)="deleteRecord($event)" (aconfirmation)="activateRecord($event)"></ceirpanel-feature-delete>
  `,
  styles: [`.dropdown-toggle::after{display:none}`],
})
export class FeatureListComponent extends ExtendableListComponent {
  public features!: FeatureModel[];
  public total!: number;
  public loading = true;
  public selected: any[] = [];
  @ViewChild(FeatureDeleteComponent) deleteUser !: FeatureDeleteComponent;
  rowSizeForExport!:number;
  constructor(
    private deviceService: DeviceService,
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private apicall: ApiUtilService,
    public permission: NgxPermissionsService,
    public exportService: ExportService,
    public uploadService: UploadService,
    private featureService: FeatureService) {
    super();
    this.apicall.get('/config/frontend').subscribe({next: (data:any) => this.rowSizeForExport = data?.rowSizeForExport || 1000});
  }

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.state = state;
    
    this.cdRef.detectChanges();
    this.apicall.post('/feature/pagination', state).subscribe({
      next: (result) => {
        this.features = (result as FeatureList).content;
        this.total = (result as FeatureList).totalElements;
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
  deleteRecord(data: FeatureModel | Array<FeatureModel>) {
    this.selectedData = [];
    this.featureService.delete(this.featureService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  activateRecord(data: FeatureModel | Array<FeatureModel>) {
    this.selectedData = [];
    this.featureService.activate(this.featureService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  
  openDeleteModel(data: FeatureModel | Array<FeatureModel>) {
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
  openClose(open: boolean) {
    this.open = open;
    if (open && this.selectedData.length > 0) {
      this.selectedData.forEach(data => this.deleteRecord(data));
    }
  }
  export(state: ClrDatagridStateInterface) {
    const st = _.cloneDeep(state);
    if(st && st.page) st.page.size = this.rowSizeForExport;
    this.apicall.post('/feature/pagination', st).subscribe({
      next: (result) => {
        const features = (result as FeatureList).content;
        this.exportService.features(features, `${_.now()}_features`,{showLabels: true,headers: ["ID", "Created On", "Feature Name","Category","Status"]});
      }
    });
  }
}
