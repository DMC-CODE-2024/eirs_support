import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { CeirCoreModule } from '../core/core.module';
import { FeatureDeleteComponent } from './component/feature-delete.component';
import { FeatureFilterComponent } from './component/feature-filter.component';
import { FeatureAddComponent } from './pages/feature-add.component';
import { FeatureListComponent } from './pages/feature-list.component';

@NgModule({
  declarations: [FeatureAddComponent, FeatureListComponent, FeatureFilterComponent, FeatureDeleteComponent],
  imports: [CeirCommonModule, CeirCoreModule,  NgxPermissionsModule.forChild({
    permissionsIsolate: true, 
    rolesIsolate: true}), FileUploadModule],
})
export class FeatureModule {}
