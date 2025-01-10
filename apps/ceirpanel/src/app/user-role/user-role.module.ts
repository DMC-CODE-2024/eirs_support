import { NgModule } from '@angular/core';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { CeirCoreModule } from '../core/core.module';
import { UserRoleFilterComponent } from './component/user-role-filter.component';
import { UserRoleAddComponent } from './pages/user-role-add.component';

@NgModule({
  declarations: [UserRoleAddComponent, UserRoleFilterComponent],
  imports: [CeirCommonModule, AngularDualListBoxModule, CeirCoreModule,NgxPermissionsModule.forChild({
    permissionsIsolate: true, 
    rolesIsolate: true})],
})
export class UserRoleModule {}
