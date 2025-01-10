/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import * as _ from "lodash";
import { take } from 'rxjs';
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { UserList } from '../../core/models/user.model';
import { ExportService } from '../../core/services/common/export.service';
import { UserRoleDeleteComponent } from '../component/user-role-delete.component';
import { UserRoleDto } from '../dto/user.role.dto';
import { UserRoleService } from '../service/user.role.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'ceirpanel-user-role-list',
  templateUrl: '../html/user-role-list.component.html',
  styles: [`.dropdown-toggle::after{display:none}`],
})
export class UserRoleListComponent extends ExtendableListComponent {
  list: UserRoleDto = {totalElements: 0} as UserRoleDto;
  @ViewChild(UserRoleDeleteComponent) userGroupDelete!: UserRoleDeleteComponent;
  groupId = 0;
  public loading = true;
  constructor(
    private userService: UserService,
    private userRoleService: UserRoleService,
    private cdRef: ChangeDetectorRef,
    public exportService: ExportService
  ) {
    super();
  }
  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.state = state;
    this.cdRef.detectChanges();
    this.userRoleService.pagination(state).subscribe({
      next: (users: UserRoleDto) => {
        this.list = users;
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }
  export(state: ClrDatagridStateInterface) {
    const st = _.cloneDeep(state);
    if(st && st.page) st.page.size = 10000;
    this.userRoleService
      .pagination(st)
      .pipe(take(1))
      .subscribe((modules: UserRoleDto) => {
        this.exportService.userRoles(
          modules.content,
          `user-roles-${new Date().getMilliseconds()}`,
          {
            showLabels: true,
            headers: ['Created On', 'User','Role', 'Status'],
          }
        );
      });
  }

  deleteRecord(data: UserRoleDto | Array<UserRoleDto>) {
    this.selectedData = [];
    this.userRoleService.delete(this.userRoleService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  activateRecord(data: UserRoleDto | Array<UserRoleDto>) {
    this.selectedData = [];
    this.userRoleService.activate(this.userRoleService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  
  openDeleteModel(data: UserRoleDto | Array<UserRoleDto>) {
    this.userGroupDelete.userGroup = null!;
    if(_.isArray(data) && data.length > 1){
      this.userGroupDelete.userGroups = data;
    } else if(_.isArray(data) && data.length == 1){
      this.userGroupDelete.userGroup = data[0];
      this.userGroupDelete.status = data[0].status;
    } else if(!_.isArray(data)){
      this.userGroupDelete.userGroup = data;
      this.userGroupDelete.status = data.status;
    }
    this.userGroupDelete.open = true; 
  }
}
