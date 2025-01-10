/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import * as _ from "lodash";
import { take } from 'rxjs';
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { UserList } from '../../core/models/user.model';
import { ExportService } from '../../core/services/common/export.service';
import { UserFeatureDeleteComponent } from '../component/user-feature-delete.component';
import { UserFeatureDto } from '../dto/user.feature.dto';
import { UserFeatureService } from '../service/user.feature.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'ceirpanel-user-feature-list',
  templateUrl: '../html/user-feature-list.component.html',
  styles: [`.dropdown-toggle::after{display:none}`],
})
export class UserFeatureListComponent extends ExtendableListComponent {
  list: UserFeatureDto = {totalElements: 0} as UserFeatureDto;
  @ViewChild(UserFeatureDeleteComponent) userGroupDelete!: UserFeatureDeleteComponent;
  groupId = 0;
  public loading = true;
  constructor(
    private userService: UserService,
    private userFeatureService: UserFeatureService,
    private cdRef: ChangeDetectorRef,
    public exportService: ExportService
  ) {
    super();
  }
  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.state = state;
    this.cdRef.detectChanges();
    this.userFeatureService.pagination(state).subscribe({
      next: (users: UserFeatureDto) => {
        this.list = users;
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }
  export(state: ClrDatagridStateInterface) {
    const st = _.cloneDeep(state);
    if(st && st.page) st.page.size = 10000;
    this.userFeatureService
      .pagination(st)
      .pipe(take(1))
      .subscribe((modules: UserFeatureDto) => {
        this.exportService.userFeatures(
          modules.content,
          `user-features-${new Date().getMilliseconds()}`,
          {
            showLabels: true,
            headers: ['Created On', 'User', 'Feature','Status'],
          }
        );
      });
  }

  deleteRecord(data: UserFeatureDto | Array<UserFeatureDto>) {
    this.selectedData = [];
    this.userFeatureService.delete(this.userFeatureService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  activateRecord(data: UserFeatureDto | Array<UserFeatureDto>) {
    this.selectedData = [];
    this.userFeatureService.activate(this.userFeatureService.getDeleteDto(data)).pipe(take(1)).subscribe(() => this.refresh(this.state));
  }
  
  openDeleteModel(data: UserFeatureDto | Array<UserFeatureDto>) {
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
