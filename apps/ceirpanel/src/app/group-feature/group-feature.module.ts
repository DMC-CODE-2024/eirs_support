import { NgModule } from '@angular/core';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { GroupFeatureDeleteComponent } from './component/group-feature-delete.component';
import { GroupFeatureFilterComponent } from './component/group-feature-filter.component';
import { Inventory } from './inventory/inventory';
import { GroupFeatureListAdvancedComponent } from './pages/group-feature-list-advanced.component';

@NgModule({
  declarations: [
    GroupFeatureFilterComponent, 
    GroupFeatureListAdvancedComponent, GroupFeatureDeleteComponent],
  imports: [CeirCommonModule, AngularDualListBoxModule, NgxPermissionsModule.forChild({
    permissionsIsolate: true, 
    rolesIsolate: true})],
  providers: [Inventory]
})
export class GroupFeatureModule {}
