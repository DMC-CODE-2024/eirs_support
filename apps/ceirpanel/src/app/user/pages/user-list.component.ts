import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';

import { NavigationExtras, Router } from '@angular/router';
import {
  ClrDatagrid,
  ClrDatagridStateInterface,
  ClrSignpostTrigger,
} from '@clr/angular';
import * as _ from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import { take } from 'rxjs';
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { UserList, UserModel } from '../../core/models/user.model';
import { ExportService } from '../../core/services/common/export.service';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { DeviceService } from '../../core/services/device.service';
import { PasswordResetComponent } from '../component/password-reset';
import { UserDeleteComponent } from '../component/user-delete.component';
import { UserService } from '../service/user.service';
import { ApiUtilService } from '../../core/services/common/api.util.service';

@Component({
  selector: 'ceirpanel-user-list',
  templateUrl: '../html/user-list.component.html',
  styles: [
    `
      .dropdown-toggle::after {
        display: none;
      }
    `,
  ],
  providers: [DeviceService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent extends ExtendableListComponent {
  @ViewChild(ClrSignpostTrigger, { static: false })
  clrSignpostTrigger!: ClrSignpostTrigger;
  @ViewChild(ClrDatagrid) clrGrid!: ClrDatagrid;
  @ViewChild(UserDeleteComponent) deleteUser!: UserDeleteComponent;
  @ViewChild(PasswordResetComponent) passwordReset!: PasswordResetComponent;
  public selected: UserModel[] = [];
  signPost = false;
  public selectedUsers: UserModel[] = [];
  list!: Array<UserModel>;
  public total!: number;
  public loading = true;
  rowSizeForExport!: number;
  constructor(
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    public permission: NgxPermissionsService,
    public exportService: ExportService,
    private router: Router,
    public menuTransport: MenuTransportService,
    private apicall: ApiUtilService
  ) {
    super();
    this.apicall.get('/config/frontend').subscribe({next: (data:any) => this.rowSizeForExport = data?.rowSizeForExport || 1000});
  }

  refresh(state: ClrDatagridStateInterface) {
    this.state = state;
    this.loading = true;
    this.userService.pagination(state).subscribe({
      next: (result) => {
        this.list = (result as UserList).content;
        this.total = (result as UserList).totalElements;
        this.cdRef.detectChanges();
        this.loading = false;
      },
      complete: () => {
        this.cdRef.detectChanges();
        this.loading = false;
      }
    });
  }

  deleteRecord(data: UserModel | Array<UserModel>) {
    this.selectedData = [];
    this.userService
      .delete(this.userService.getDeleteDto(data))
      .pipe(take(1))
      .subscribe(() => this.refresh(this.state));
  }
  activateRecord(data: UserModel | Array<UserModel>) {
    this.selectedData = [];
    this.userService
      .activate(this.userService.getDeleteDto(data))
      .pipe(take(1))
      .subscribe(() => this.refresh(this.state));
  }

  openDeleteModel(data: UserModel | Array<UserModel>) {
    this.deleteUser.userGroup = null!;
    if (_.isArray(data) && data.length > 1) {
      this.deleteUser.users = data;
      this.deleteUser.status = '1';
    } else if (_.isArray(data) && data.length == 1) {
      this.deleteUser.userGroup = data[0];
      this.deleteUser.status = data[0].currentStatus;
    } else if (!_.isArray(data)) {
      this.deleteUser.userGroup = data;
      this.deleteUser.status = data.currentStatus;
    }
    this.deleteUser.open = true;
  }
  openResetModel(data: UserModel | Array<UserModel>) {
    this.passwordReset.userGroup = null!;
    if (_.isArray(data) && data.length > 1) {
      this.passwordReset.users = data;
      this.passwordReset.status =  '1';
    } else if (_.isArray(data) && data.length == 1) {
      this.passwordReset.userGroup = data[0];
      this.passwordReset.status = data[0].currentStatus;
    } else if (!_.isArray(data)) {
      this.passwordReset.userGroup = data;
      this.passwordReset.status = data.currentStatus;
    }
    this.passwordReset.open = true;
  }

  openClose(open: boolean) {
    this.open = open;
    if (open && this.selectedData.length > 0) {
      this.selectedData.forEach((data) => this.deleteRecord(data));
    }
  }

  export(state: ClrDatagridStateInterface) {
    const st = _.cloneDeep(state);
    if (st && st.page) st.page.size = this.rowSizeForExport;
    this.userService
      .pagination(st)
      .pipe(take(1))
      .subscribe((result) => {
        this.exportService.users(
          (result as UserList).content,
          `${_.now()}_users`,
          {
            showLabels: true,
            headers: [
              'ID',
              'Created On',
              'First Name',
              'Last Name',
              'User Name',
              'Organization',
              'Status',
            ],
          }
        );
      });
  }
  assignGroup(data: Array<UserModel>) {
    const users: { id: number; userName: string }[] = [];
    data.forEach((d) => users.push({ id: d.id, userName: d.userName }));
    const queryParams = { users: JSON.stringify(users) };
    const navigationExtras: NavigationExtras = {
      queryParams,
    };
    this.router.navigate(['/user-group/add'], navigationExtras);
  }
  resetpassword(data: UserModel | Array<UserModel>) {
    this.selectedData = [];
    this.userService
      .resetpassword(this.userService.getDeleteDto(data))
      .pipe(take(1))
      .subscribe((res) => {
        console.log('message: ', _.get(res,'message'));
        this.menuTransport.alert = {type: 'success', message: _.get(res,'message')};
        this.selecton = null;
        this.multiselect = false;
        this.refresh(this.state);
      });
  }
}
