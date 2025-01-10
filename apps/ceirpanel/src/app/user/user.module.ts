import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { ValidateEqualModule } from 'ng-validate-equal';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { ValidateEmailDirective } from '../core/directive/email.validator';
import { UserDeleteComponent } from './component/user-delete.component';
import { UserDetailViewComponent } from './component/user-detail-view.component';
import { UserFeatureDeleteComponent } from './component/user-feature-delete.component';
import { UserFilterComponent } from './component/user-filter.component';
import { UserGroupDeleteComponent } from './component/user-group-delete.component';
import { UserRoleDeleteComponent } from './component/user-role-delete.component';
import { ChangePasswordComponent } from './pages/change.password.component';
import { UserAddComponent } from './pages/user-add.componenent';
import { UserFeatureListComponent } from './pages/user-feature-list.component';
import { UserGroupAddComponent } from './pages/user-group-add.component';
import { UserGroupListComponent } from './pages/user-group-list.component';
import { UserListComponent } from './pages/user-list.component';
import { UserRoleListComponent } from './pages/user-role-list.component';
import { UserGroupService } from './service/user.group.service';
import { UserRoleService } from './service/user.role.service';
import { UserService } from './service/user.service';
import { routes } from './user.routes';
import { PasswordResetComponent } from './component/password-reset';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UserMobileEmailVerificationComponent } from './component/user-mobile-email-verification';
import { NgOtpInputModule } from 'ng-otp-input';
import { DualListboxModule } from '@ceirpanel/dual-listbox';

@NgModule({
  declarations: [
    UserListComponent, 
    UserAddComponent, 
    UserDetailViewComponent,
    UserDeleteComponent,
    UserFilterComponent,
    ValidateEmailDirective,
    ChangePasswordComponent,
    UserGroupListComponent,
    UserGroupAddComponent,
    UserGroupDeleteComponent,
    UserRoleListComponent,
    UserRoleDeleteComponent,
    UserFeatureDeleteComponent,
    UserFeatureListComponent,
    PasswordResetComponent,
    UserMobileEmailVerificationComponent
  ],
  imports: [
    NgOtpInputModule,
    CeirCommonModule, 
    ValidateEqualModule,
    RouterModule.forChild(routes),
    NgxPermissionsModule,
    AngularDualListBoxModule,
    DualListboxModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  exports: [
    UserDetailViewComponent
  ],
  providers: [
    UserService,
    UserGroupService,
    UserRoleService
  ]
})
export class UserModule {
  
}
