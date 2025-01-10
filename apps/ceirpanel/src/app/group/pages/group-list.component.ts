/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { GroupList, GroupModel } from '../../core/models/group.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { DeviceService } from '../../core/services/device.service';
import { ExportService } from '../../core/services/common/export.service';
import * as _ from "lodash";

@Component({
  selector: 'ceirpanel-group-list',
  template: `
  <div class="card">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-4" style="margin-top: 5px;">
          <h4 class="card-title">{{ "group.pageTitle.list" | translate }}</h4>
        </div>
        <div class="clr-col-6 m-0 p-0">
          <div class="btn-group btn-primary float-end">
            <clr-toggle-container class="clr-toggle-right m-0 p-0 mt-1">
              <clr-toggle-wrapper>
                <label>{{ "button.multiSelect" | translate }}</label>
                <input type="checkbox" clrToggle (change)="changeView($event)"/>
              </clr-toggle-wrapper>
            </clr-toggle-container>
            <button class="btn btn-outline mx-1" aria-label="Check" [disabled]="!multiselect" (click)="confirmation(selected)">
              {{ "group.pageTitle.delete" | translate }}
            </button>
            <ng-template [ngxPermissionsOnly]="['GROUP_ADD']" [ngxPermissionsOnlyThen]="showAdd" [ngxPermissionsOnlyElse]="hideAdd"></ng-template>
            <ng-template #showAdd>
              <button class="btn" aria-label="Check" [routerLink]="['add','']">
                <cds-icon shape="plus" solid="true" inverse="true"></cds-icon> {{ "group.pageTitle.add" | translate }}
              </button>
            </ng-template>
            <ng-template #hideAdd>
              <button class="btn" aria-label="Check" [routerLink]="['add','']" disabled>
                <cds-icon shape="plus" solid="true" inverse="true"></cds-icon> {{ "group.pageTitle.add" | translate }}
              </button>
            </ng-template>
          </div>  
        </div>
      </div>
    </div>
    <div class="card-block m-0 p-0">
      <ceirpanel-filter (filter)="applyFilter($event);refresh(state)" [startDate]="true" [endDate]="true" [groupName]="true" [parentGroupName]="true"></ceirpanel-filter>
      <div *ngIf="multiselect; then multiSelect else singleselect"></div>
      <ng-template #multiSelect>
        <clr-datagrid class="datagrid-compact" (clrDgRefresh)="refresh($event)" [clrDgLoading]="loading"
          [(clrDgSelected)]="selected" class="mt-2">
          <clr-dg-action-bar>
            <ceirpanel-list-action [state]="state" (download)="export($event)" (refresh)="refresh($event)"
            (filter)="callFilter()" (resetFilter)="resetFilter()"></ceirpanel-list-action>
          </clr-dg-action-bar>
          <clr-dg-column>{{ "datalist.createDate" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.modifiedDate" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.parentGroupName" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.status" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.features" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.roles" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.action" | translate }}</clr-dg-column>
          <clr-dg-row *ngFor="let group of groups; let i = index;" [clrDgItem]="group">
            <clr-dg-cell>{{group.createdOn |date:'yyyy-MM-dd'}}</clr-dg-cell>
            <clr-dg-cell class="text-truncate">
              <span *ngIf="group.parent; else parent">{{group?.parent?.groupName}}</span>
              <ng-template #parent>
                <span class="text-danger">Not Available</span>
              </ng-template>
            </clr-dg-cell>
            <clr-dg-cell class="text-truncate">{{group.groupName}}</clr-dg-cell>
            <clr-dg-cell><ceirpanel-status [status]="group.status"></ceirpanel-status></clr-dg-cell>
            <clr-dg-cell>
              <a class="m-0 p-0" [routerLink]="['/group-feature/edit',group.id]">
                <span class="badge" [ngClass]="group?.features?.length! > 0 ? 'badge-info': 'badge-danger'">{{group?.features?.length}}</span>
              </a>
            </clr-dg-cell>
            <clr-dg-cell>
              <a class="m-0 p-0" [routerLink]="['/group-role/edit',group.id]">
                <span class="badge" [ngClass]="group?.roles?.length! > 0 ? 'badge-info': 'badge-danger'">{{group?.roles?.length}}</span>
              </a>
            </clr-dg-cell>
            <clr-dg-cell>
              <clr-dropdown [clrCloseMenuOnItemClick]="false">
                <button clrDropdownTrigger aria-label="Dropdown demo button" class="m-0 p-0">
                  <cds-icon shape="ellipsis-vertical"></cds-icon>
                </button>
                <clr-dropdown-menu *clrIfOpen [clrPosition]="'bottom-right'">
                  <ng-template [ngxPermissionsOnly]="['GROUP_VIEW']" [ngxPermissionsOnlyThen]="showView" [ngxPermissionsOnlyElse]="hideView"></ng-template>
                  <ng-template #showView>
                    <button class="action-item" [routerLink]="['view',group.id]" clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideView>
                    <button class="action-item" [routerLink]="['view',group.id]" disabled clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['GROUP_EDIT']" [ngxPermissionsOnlyThen]="showEdit" [ngxPermissionsOnlyElse]="hideEdit"></ng-template>
                  <ng-template #showEdit>
                    <button class="action-item" [routerLink]="['edit',group.id]" clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideEdit>
                    <button class="action-item" [routerLink]="['edit',group.id]" disabled clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['GROUP_DELETE']" [ngxPermissionsOnlyThen]="showDelete" [ngxPermissionsOnlyElse]="hideDelete"></ng-template>
                  <ng-template #showDelete>
                    <button class="action-item" (click)="confirmation([group])" clrDropdownItem>
                      <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideDelete>
                    <button class="action-item" (click)="confirmation([group])" disabled clrDropdownItem>
                      <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                    </button>
                  </ng-template>
                </clr-dropdown-menu>
              </clr-dropdown>
            </clr-dg-cell>
          </clr-dg-row>
          <clr-dg-footer>
            <clr-dg-pagination #pagination [clrDgPageSize]="10" [clrDgTotalItems]="total">
              <clr-dg-page-size [clrPageSizeOptions]="[10,20,50,100]"><span class="text-capitalize">{{ "footer.groups"| translate }}</span> {{ "footer.perPage"| translate }}</clr-dg-page-size>
              {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}}
              {{ "footer.of"| translate }} {{pagination.totalItems}} {{ "footer.groups"| translate }}
            </clr-dg-pagination>
          </clr-dg-footer>
        </clr-datagrid>
      </ng-template>
      <ng-template #singleselect>
        <clr-datagrid class="datagrid-compact" [clrDgLoading]="loading" (clrDgRefresh)="refresh($event)" class="mt-2">
          <clr-dg-action-bar>
            <ceirpanel-list-action [state]="state" (download)="export($event)" (refresh)="refresh($event)"
            (filter)="callFilter()" (resetFilter)="resetFilter()"></ceirpanel-list-action>
          </clr-dg-action-bar>
          <clr-dg-column>{{ "datalist.createDate" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.parentGroupName" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.groupName" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.status" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.features" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.roles" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.action" | translate }}</clr-dg-column>
          <clr-dg-row *ngFor="let group of groups; let i = index;" [clrDgItem]="group">
            <clr-dg-cell>{{group.createdOn |date:'yyyy-MM-dd'}}</clr-dg-cell>
            <clr-dg-cell class="text-truncate">
              <span *ngIf="group.parent; else parent">{{group?.parent?.groupName}}</span>
              <ng-template #parent>
                <span class="text-danger">Not Available</span>
              </ng-template>
            </clr-dg-cell>
            <clr-dg-cell class="text-truncate">{{group.groupName}}</clr-dg-cell>
            <clr-dg-cell><ceirpanel-status [status]="group.status"></ceirpanel-status></clr-dg-cell>
            <clr-dg-cell>
              <a class="m-0 p-0" [routerLink]="['/group-feature/edit',group.id]">
                <span class="badge" [ngClass]="group?.features?.length! > 0 ? 'badge-info': 'badge-danger'">{{group?.features?.length}}</span>
              </a>
            </clr-dg-cell>
            <clr-dg-cell>
              <a class="m-0 p-0" [routerLink]="['/group-role/edit',group.id]">
                <span class="badge" [ngClass]="group?.roles?.length! > 0 ? 'badge-info': 'badge-danger'">{{group?.roles?.length}}</span>
              </a>
            </clr-dg-cell>
            <clr-dg-cell>
              <clr-dropdown [clrCloseMenuOnItemClick]="false">
                <button clrDropdownTrigger aria-label="Dropdown demo button" class="m-0 p-0">
                  <cds-icon shape="ellipsis-vertical"></cds-icon>
                </button>
                <clr-dropdown-menu *clrIfOpen [clrPosition]="'bottom-right'">
                  <ng-template [ngxPermissionsOnly]="['GROUP_VIEW']" [ngxPermissionsOnlyThen]="showView" [ngxPermissionsOnlyElse]="hideView"></ng-template>
                  <ng-template #showView>
                    <button class="action-item" [routerLink]="['view',group.id]" clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideView>
                    <button class="action-item" [routerLink]="['view',group.id]" disabled clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['GROUP_EDIT']" [ngxPermissionsOnlyThen]="showEdit" [ngxPermissionsOnlyElse]="hideEdit"></ng-template>
                  <ng-template #showEdit>
                    <button class="action-item" [routerLink]="['edit',group.id]" clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideEdit>
                    <button class="action-item" [routerLink]="['edit',group.id]" disabled clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['GROUP_DELETE']" [ngxPermissionsOnlyThen]="showDelete" [ngxPermissionsOnlyElse]="hideDelete"></ng-template>
                  <ng-template #showDelete>
                    <button class="action-item" (click)="confirmation([group])" clrDropdownItem>
                      <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideDelete>
                    <button class="action-item" (click)="confirmation([group])" disabled clrDropdownItem>
                      <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                    </button>
                  </ng-template>
                </clr-dropdown-menu>
              </clr-dropdown>
            </clr-dg-cell>
          </clr-dg-row>
          <clr-dg-footer>
            <clr-dg-pagination #pagination [clrDgPageSize]="10" [clrDgTotalItems]="total">
              <clr-dg-page-size [clrPageSizeOptions]="[10,20,50,100]"><span class="text-capitalize">{{ "footer.groups"| translate }}</span> {{ "footer.perPage"| translate }}</clr-dg-page-size>
              {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}}
              {{ "footer.of"| translate }} {{pagination.totalItems}} {{ "footer.groups"| translate }}
            </clr-dg-pagination>
          </clr-dg-footer>
        </clr-datagrid>
      </ng-template>
    </div>
  </div>
  <ceirpanel-group-delete [open]="open" (confirmation)="openClose($event)" [groups]="selectedData" *ngIf="selectedData.length > 0"></ceirpanel-group-delete>
  `,
  styles: [`.dropdown-toggle::after{display:none}`],
})
export class GroupListComponent extends ExtendableListComponent {
  public groups!: GroupModel[];
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
    console.log('state: ', this.state);

    this.cdRef.detectChanges();
    this.apicall.post('/group/pagination', state).subscribe({
      next: (result) => {
        this.groups = (result as GroupList).content;
        this.total = (result as GroupList).totalElements;
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
        console.log('result:', result);
      },
      error: (e) => this.loading = false,
      complete: () => {
        console.log('completed');
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
    console.log('inside export..');
    this.apicall.post('/group/pagination', st).subscribe({
      next: (result) => {
        const groups = (result as GroupList).content;
        this.exportService.groups(groups, `groups-${new Date().getMilliseconds()}`,{showLabels: true,headers: ["ID", "Created On", "Group Name","Parent Group Name"]});
      }
    });
  }
}