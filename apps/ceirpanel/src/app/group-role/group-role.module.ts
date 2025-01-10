import { NgModule } from '@angular/core';
import { DualListboxModule } from '@ceirpanel/dual-listbox';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { CeirCoreModule } from '../core/core.module';
import { GroupRoleDeleteComponent } from './component/group-role-delete.component';
import { GroupRoleFilterComponent } from './component/group-role-filter.component';
import { Inventory } from './inventory/inventory';
import { GroupRoleListAdvancedComponent } from './pages/group-role-list-advanced.component';

@NgModule({
  declarations: [
    GroupRoleFilterComponent, GroupRoleDeleteComponent,
    GroupRoleListAdvancedComponent, GroupRoleDeleteComponent
  ],
  imports: [CeirCommonModule, DualListboxModule, CeirCoreModule,  NgxPermissionsModule.forChild({
    permissionsIsolate: true, 
    rolesIsolate: true})],
  providers: [Inventory]
})
export class GroupRoleModule {}
