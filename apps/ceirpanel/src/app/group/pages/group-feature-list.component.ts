/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import * as _ from 'lodash';
import { lastValueFrom, take } from 'rxjs';
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { ExportService } from '../../core/services/common/export.service';
import { GroupFeatureDeleteComponent } from '../component/group-feature-delete.component';
import { GroupFeatureDto } from '../dto/group.feature.dto';
import { GroupFeatureService } from '../service/group.feature.service';
import { ActivatedRoute } from '@angular/router';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ceirpanel-group-feature-list',
  templateUrl: '../html/group-feature-list.component.html',
  styles: [
    `
      .dropdown-toggle::after {
        display: none;
      }
    `,
  ],
})
export class GroupFeatureListComponent extends ExtendableListComponent {
  @ViewChild(GroupFeatureDeleteComponent) groupFeatureDelete!: GroupFeatureDeleteComponent;
  list: GroupFeatureDto = { totalElements: 0 } as GroupFeatureDto;
  groupId = 0;
  public loading = true;
  rowSizeForExport!:number;
  constructor(
    private cdRef: ChangeDetectorRef,
    public exportService: ExportService,
    private groupFeatureService: GroupFeatureService,
    route: ActivatedRoute,
    private apicall: ApiUtilService,
    private translate: TranslateService
  ) {
    super();
    route.params.subscribe(param => {
      this.groupId = param['groupId'] || 0;
      if(this.state)this.refresh(this.state);
    });
    this.apicall.get('/config/frontend').subscribe({next: (data:any) => this.rowSizeForExport = data?.rowSizeForExport || 1000});
  }

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.state = state;
    if(this.groupId > 0) this.pushFilter({groupId: this.groupId});
    this.cdRef.detectChanges();
    this.applyExisterFilter();
    this.groupFeatureService.pagination(state).subscribe({
      next: (users: GroupFeatureDto) => {
        this.list = users;
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }
  export(state: ClrDatagridStateInterface) {
    const st = _.cloneDeep(state);
    if(st && st.page) st.page.size = this.rowSizeForExport;
    this.groupFeatureService
      .pagination(st).subscribe({
        next: async (data: GroupFeatureDto) => {
          const list = data.content;
          this.exportService.groupFeatures(list, `${_.now()}_group-features`,{showLabels: true,headers: [
            await lastValueFrom(this.translate.get('datalist.createDate')),
            await lastValueFrom(this.translate.get('datalist.groupName')),
            await lastValueFrom(this.translate.get('datalist.featureName')),
            await lastValueFrom(this.translate.get('datalist.status'))
          ]});
        }
      });
  }
  deleteRecord(data: GroupFeatureDto | Array<GroupFeatureDto>) {
    this.selectedData = [];
    this.groupFeatureService.delete(this.groupFeatureService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  activateRecord(data: GroupFeatureDto | Array<GroupFeatureDto>) {
    this.selectedData = [];
    this.groupFeatureService.activate(this.groupFeatureService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  
  openDeleteModel(data: GroupFeatureDto | Array<GroupFeatureDto>, status?: string) {
    this.groupFeatureDelete.userGroup = null!;
    if(_.isArray(data) && data.length > 1){
      this.groupFeatureDelete.userGroups = data;
      this.groupFeatureDelete.status = '1';
    } else if(_.isArray(data) && data.length == 1){
      this.groupFeatureDelete.userGroup = data[0];
      this.groupFeatureDelete.status = data[0].status;
    } else if(!_.isArray(data)){
      this.groupFeatureDelete.userGroup = data;
      this.groupFeatureDelete.status = data.status;
    }
    this.groupFeatureDelete.open = true; 
  }
}
