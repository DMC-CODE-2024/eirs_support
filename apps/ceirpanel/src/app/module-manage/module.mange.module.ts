import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { CeirCoreModule } from '../core/core.module';
import { ModuleDeleteComponent } from './component/module-delete.component';
import { ModuleFilterComponent } from './component/module-filter.component';
import { ModuleAddComponent } from './pages/module-add.component';
import { ModuleListComponent } from './pages/module-list.component';

@NgModule({
  declarations: [ModuleAddComponent, ModuleListComponent, ModuleFilterComponent, ModuleDeleteComponent],
  imports: [CeirCommonModule, CeirCoreModule, NgxPermissionsModule.forChild()],
})
export class ModuleMangeModule {}
