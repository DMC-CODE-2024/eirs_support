import { NgModule } from '@angular/core';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { FeatureModuleFilterComponent } from './component/feature-module-filter.component';
import { FeatureModuleAddComponent } from './pages/feature-module-add.component';
import { FeatureModuleListComponent } from './pages/feature-module-list.component';
import { CeirCoreModule } from '../core/core.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FeatureModuleDeleteComponent } from './component/feature-module-delete.component';

@NgModule({
  declarations: [FeatureModuleAddComponent, FeatureModuleListComponent, FeatureModuleFilterComponent, FeatureModuleDeleteComponent],
  imports: [CeirCommonModule, AngularDualListBoxModule, CeirCoreModule, NgxPermissionsModule.forChild({
    permissionsIsolate: true, 
    rolesIsolate: true})],
})
export class FeatureModuleModule {}
