import { NgModule } from '@angular/core';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { TagFilterComponent } from './component/tag-filter.component';
import { TagAddComponent } from './pages/tag-add.component';
import { TagListComponent } from './pages/tag-list.component';
import { CeirCoreModule } from '../core/core.module';
import { TagDeleteComponent } from './component/tag-delete.component';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [TagListComponent, TagAddComponent, TagFilterComponent, TagDeleteComponent],
  imports: [CeirCommonModule, CeirCoreModule, NgxPermissionsModule.forChild({
    permissionsIsolate: true, 
    rolesIsolate: true})],
})
export class TagModule {}
