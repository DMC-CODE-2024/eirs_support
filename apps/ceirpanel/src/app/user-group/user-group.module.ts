import { NgModule } from '@angular/core';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { CeirCoreModule } from '../core/core.module';
import { UserGroupDeleteComponent } from './component/user-group-delete.component';
import { UserGroupFilterComponent } from './component/user-group-filter.component';
import { UserGroupListAdvancedComponent } from './pages/user-group-list-advanced.component';

@NgModule({
  declarations: [
    UserGroupFilterComponent, UserGroupListAdvancedComponent,
    UserGroupDeleteComponent
  ],
  imports: [CeirCommonModule, AngularDualListBoxModule, CeirCoreModule, NgxPermissionsModule.forChild({
    permissionsIsolate: true, 
    rolesIsolate: true})],
})
export class UserGroupModule {}
