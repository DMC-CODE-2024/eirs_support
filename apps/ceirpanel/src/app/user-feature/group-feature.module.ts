import { NgModule } from '@angular/core';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { CeirCoreModule } from '../core/core.module';
import { UserFeatureFilterComponent } from './component/user-feature-filter.component';
import { UserFeatureAddComponent } from './pages/user-feature-add.component';

@NgModule({
  declarations: [UserFeatureAddComponent, UserFeatureFilterComponent],
  imports: [CeirCommonModule, AngularDualListBoxModule, CeirCoreModule, NgxPermissionsModule.forChild({
    permissionsIsolate: true, 
    rolesIsolate: true})],
})
export class UserFeatureModule {}
