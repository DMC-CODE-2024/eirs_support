/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import * as _ from 'lodash';
import { lastValueFrom, take } from 'rxjs';
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { ExportService } from '../../core/services/common/export.service';
import { GroupRoleDto } from '../dto/group.role.dto';
import { GroupRoleService } from '../service/group.role.service';
import { GroupRoleDeleteComponent } from '../component/group-role-delete.component';
import { ActivatedRoute } from '@angular/router';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ceirpanel-group-role-list',
  templateUrl: '../html/group-role-list.component.html',
  styles: [
    `
      .dropdown-toggle::after {
        display: none;
      }
    `,
  ],
})
export class GroupRoleListComponent extends ExtendableListComponent {
  @ViewChild(GroupRoleDeleteComponent) groupGroupDelete!: GroupRoleDeleteComponent;
  list: GroupRoleDto = { totalElements: 0 } as GroupRoleDto;
  groupId = 0;
  public loading = true;
  rowSizeForExport!: number;
  constructor(
    private translate: TranslateService,
    private cdRef: ChangeDetectorRef,
    public exportService: ExportService,
    private groupRoleService: GroupRoleService,
    route: ActivatedRoute,
    private apicall: ApiUtilService
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
    this.groupRoleService.pagination(state).subscribe({
      next: (users: GroupRoleDto) => {
        this.list = users;
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }
  export(state: ClrDatagridStateInterface) {
    const st = _.cloneDeep(state);
    if (st && st.page) st.page.size = this.rowSizeForExport;

    this.groupRoleService.pagination(st).subscribe({
      next: async (result: GroupRoleDto) => {
        const modules = result.content;
        this.exportService.groupRoles(result?.content, `${_.now()}-roles`,{showLabels: true,headers: [
          await lastValueFrom(this.translate.get('datalist.createDate')),
          await lastValueFrom(this.translate.get('datalist.groupName')),
          await lastValueFrom(this.translate.get('datalist.roleName')),
          await lastValueFrom(this.translate.get('datalist.status'))
        ]});
      }
    });
  }
  deleteRecord(data: GroupRoleDto | Array<GroupRoleDto>) {
    this.selectedData = [];
    this.groupRoleService.delete(this.groupRoleService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  activateRecord(data: GroupRoleDto | Array<GroupRoleDto>) {
    this.selectedData = [];
    this.groupRoleService.activate(this.groupRoleService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  
  openDeleteModel(data: GroupRoleDto | Array<GroupRoleDto>) {
    this.groupGroupDelete.userGroup = null!;
    if(_.isArray(data) && data.length > 1){
      this.groupGroupDelete.userGroups = data;
      this.groupGroupDelete.status = '1';
    } else if(_.isArray(data) && data.length == 1){
      this.groupGroupDelete.userGroup = data[0];
      this.groupGroupDelete.status = data[0].status;
    } else if(!_.isArray(data)){
      this.groupGroupDelete.userGroup = data;
      this.groupGroupDelete.status = data.status;
    }
    this.groupGroupDelete.open = true; 
  }
}
