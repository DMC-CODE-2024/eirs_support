import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { CeirCoreModule } from '../core/core.module';
import { RoleFilterComponent } from './component/role-filter.component';
import { RoleAddComponent } from './pages/role-add.component';
import { RoleListComponent } from './pages/role-list.component';
import { RoleDeleteComponent } from './component/role-delete.component';

@NgModule({
  declarations: [RoleAddComponent, RoleListComponent, RoleFilterComponent, RoleDeleteComponent],
  imports: [CeirCommonModule, CeirCoreModule, NgxPermissionsModule.forChild({
    permissionsIsolate: true, 
    rolesIsolate: true})],
})
export class RoleModule {}
