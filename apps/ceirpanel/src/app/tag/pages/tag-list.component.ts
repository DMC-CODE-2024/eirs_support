/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { TagList, TagModel } from '../../core/models/tag.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { DeviceService } from '../../core/services/device.service';
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { ExportService } from '../../core/services/common/export.service';
import * as _ from "lodash";
import { TagService } from '../service/tag.service';
import { lastValueFrom, take } from 'rxjs';
import { TagDeleteComponent } from '../component/tag-delete.component';

@Component({
  selector: 'ceirpanel-tag-list',
  template: `
  <div class="card" style="min-height: 85vh;">
    <div class="card-header">
      <div class="row justify-content-between">
        <div class="col-4" style="margin-top: 5px;">
          <h4 class="card-title">{{ "tag.pageTitle.list" | translate }}</h4>
        </div>
        <div class="col">
          <div class="row row-cols-auto justify-content-end">
            <ng-template [ngxPermissionsOnly]="['TAG_DELETE']" [ngxPermissionsOnlyThen]="showToggle"></ng-template>
            <ng-template #showToggle>
              <div class="col m-0 p-0 mb-4 text-right">
                <clr-toggle-container class="clr-toggle-right m-0 p-0 mt-1 float-end">
                  <clr-toggle-wrapper>
                    <label>{{ "button.multiSelect" | translate }}</label>
                    <input type="checkbox" clrToggle (change)="changeView($event)"/>
                  </clr-toggle-wrapper>
                </clr-toggle-container>
              </div>
            </ng-template>
            <div class="col m-0 p-0">
              <div class="btn-group btn-primary">
                <ng-template [ngxPermissionsOnly]="['TAG_DELETE']" [ngxPermissionsOnlyThen]="showDelete"></ng-template>
                <ng-template #showDelete>
                  <button class="btn btn-outline mx-1" aria-label="Check" [disabled]="!multiselect" (click)="openDeleteModel(selecton)">
                    {{ "tag.pageTitle.delete" | translate }}
                  </button>
                </ng-template>
                <ng-template [ngxPermissionsOnly]="['TAG_ADD']" [ngxPermissionsOnlyThen]="showAdd"></ng-template>
                <ng-template #showAdd>
                  <button class="btn" aria-label="Check" [routerLink]="['add','']">
                    <cds-icon shape="plus" solid="true" inverse="true"></cds-icon> {{ "tag.pageTitle.add" | translate }}
                  </button>
                </ng-template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-block">
      <ng-template [ngxPermissionsOnly]="['TAG_FILTER']" [ngxPermissionsOnlyThen]="showFilter"></ng-template>
      <ng-template #showFilter>
        <ceirpanel-filter (filter)="applyFilter($event);refresh(state)" [startDate]="true"
        [endDate]="true" [groupName]="false" [parentGroupName]="false" [moduleTagName]="true"></ceirpanel-filter>
      </ng-template>
       <clr-datagrid class="datagrid-compact" (clrDgRefresh)="refresh($event)" [clrDgLoading]="loading"
          [(clrDgSelected)]="selecton">
          <clr-dg-action-bar>
            <ceirpanel-list-action [state]="state" (download)="export($event)" (refresh)="refresh($event)"
            (filter)="callFilter()" (resetFilter)="resetFilter()" [feature]="'TAG'"></ceirpanel-list-action>
          </clr-dg-action-bar>
          <clr-dg-column [clrDgSortBy]="'createdOn'">{{ "datalist.createDate" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'updatedOn'">{{ "datalist.modifiedDate" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'moduleTagName'">{{ "datalist.moduleTagName" | translate }}</clr-dg-column>
          <clr-dg-column [clrDgSortBy]="'status'">{{ "datalist.status" | translate }}</clr-dg-column>
          <clr-dg-column>{{ "datalist.action" | translate }}</clr-dg-column>
          <clr-dg-row *ngFor="let tag of tags; let i = index;" [clrDgItem]="tag">
            <clr-dg-cell>{{tag.createdOn|date:'yyyy-MM-dd'}}</clr-dg-cell>
            <clr-dg-cell>{{tag.updatedOn|date:'yyyy-MM-dd'}}</clr-dg-cell>
            <clr-dg-cell>{{tag.moduleTagName}}</clr-dg-cell>
            <clr-dg-cell><ceirpanel-status [status]="tag.status"></ceirpanel-status></clr-dg-cell>
            <clr-dg-cell>
              <clr-dropdown [clrCloseMenuOnItemClick]="false">
                <button clrDropdownTrigger aria-label="Dropdown demo button" class="m-0 p-0">
                  <cds-icon shape="ellipsis-vertical"></cds-icon>
                </button>
                <clr-dropdown-menu *clrIfOpen [clrPosition]="'bottom-right'">
                  <ng-template [ngxPermissionsOnly]="['TAG_VIEW']" [ngxPermissionsOnlyThen]="showView" [ngxPermissionsOnlyElse]="hideView"></ng-template>
                  <ng-template #showView>
                    <button class="action-item" [routerLink]="['view',tag.id]" clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideView>
                    <button class="action-item" [routerLink]="['view',tag.id]" disabled clrDropdownItem>
                      <cds-icon shape="view-list"></cds-icon> {{ "button.view"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['TAG_EDIT']" [ngxPermissionsOnlyThen]="showEdit" [ngxPermissionsOnlyElse]="hideEdit"></ng-template>
                  <ng-template #showEdit>
                    <button class="action-item" [routerLink]="['edit',tag.id]" clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template #hideEdit>
                    <button class="action-item" [routerLink]="['edit',tag.id]" disabled clrDropdownItem>
                      <cds-icon shape="pencil"></cds-icon> {{ "button.edit"| translate }}
                    </button>
                  </ng-template>
                  <ng-template [ngxPermissionsOnly]="['TAG_DELETE']" [ngxPermissionsOnlyThen]="showDelete" [ngxPermissionsOnlyElse]="hideDelete"></ng-template>
                  <ng-template #showDelete>
                    <div *ngIf="tag?.status!=='21' && tag?.status !== '0'; then delete else active"></div>
                    <ng-template #delete>
                      <button class="action-item" (click)="openDeleteModel(tag)" clrDropdownItem>
                        <cds-icon shape="trash"></cds-icon> {{ "button.delete"| translate }}
                      </button>
                    </ng-template>
                    <ng-template #active>
                      <button class="action-item" (click)="openDeleteModel(tag)" clrDropdownItem>
                        <cds-icon shape="plus"></cds-icon> {{ "button.active"| translate }}
                      </button>
                    </ng-template>
                  </ng-template>
                  <ng-template #hideDelete>
                    <button class="action-item" (click)="confirmation([tag])" disabled clrDropdownItem>
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
                <span class="text-capitalize">{{ "footer.tags"| translate }}</span> {{ "footer.perPage"| translate }}
              </clr-dg-page-size>
              {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}}
              {{ "footer.of"| translate }} {{pagination.totalItems}} {{ "footer.tags"| translate }}
            </clr-dg-pagination>
          </clr-dg-footer>
        </clr-datagrid>
    </div>
  </div>
  <ceirpanel-tag-delete (confirmation)="deleteRecord($event)" (aconfirmation)="activateRecord($event)"></ceirpanel-tag-delete>
  `,
  styles: [`.dropdown-toggle::after{display:none}`],
})
export class TagListComponent extends ExtendableListComponent{
  public tags!: TagModel[];
  public total!: number;
  public loading = true;
  public selected: any[] = [];
  @ViewChild(TagDeleteComponent) deleteUser !: TagDeleteComponent;
  rowSizeForExport!: number;

  constructor(
    private deviceService: DeviceService, 
    private cdRef: ChangeDetectorRef, 
    private translate: TranslateService,
    private apicall: ApiUtilService,
    public exportService: ExportService,
    private tagService: TagService,) { 
      super();
      this.apicall.get('/config/frontend').subscribe({next: (data:any) => this.rowSizeForExport = data?.rowSizeForExport || 1000});
    }

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.state = state;
    
    this.cdRef.detectChanges();
    this.applyExisterFilter();
    this.apicall.post('/tag/pagination', state).subscribe({
      next: (result) => {
        this.tags = (result as TagList).content;
        this.total = (result as TagList).totalElements;
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
  deleteRecord(data: TagModel | Array<TagModel>) {
    this.selectedData = [];
    this.tagService.delete(this.tagService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  activateRecord(data: TagModel | Array<TagModel>) {
    this.selectedData = [];
    this.tagService.activate(this.tagService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  
  openDeleteModel(data: TagModel | Array<TagModel>) {
    this.deleteUser.tag = null!;
    if(_.isArray(data) && data.length > 1){
      this.deleteUser.tags = data;
      this.deleteUser.status = '1';
    } else if(_.isArray(data) && data.length == 1){
      this.deleteUser.tag = data[0];
      this.deleteUser.status = data[0].status;
    } else if(!_.isArray(data)){
      this.deleteUser.tag = data;
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
    this.apicall.post('/tag/pagination', st).subscribe({
      next: async (result) => {
        const tags = (result as TagList).content;
        this.exportService.tags(tags, `${_.now()}_tags`,{showLabels: true,headers: [
          await lastValueFrom(this.translate.get('datalist.createDate')),
          await lastValueFrom(this.translate.get('datalist.modifiedDate')),
          await lastValueFrom(this.translate.get('datalist.moduleTagName')),
          await lastValueFrom(this.translate.get('datalist.status')),
        ]});
      }
    });
  }
}
