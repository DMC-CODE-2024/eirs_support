import { NgModule } from '@angular/core';
import { DualListboxModule } from '@ceirpanel/dual-listbox';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { AclFilterComponent } from './component/acl-filter.component';
import { AclAddComponent } from './pages/acl-add.component';
import { AclListComponent } from './pages/acl-list.component';
import { DualBoxService } from './services/dual.box.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AclDeleteComponent } from './component/acl-delete.component';
import { AclService } from './services/acl.service';
import { CeirCoreModule } from '../core/core.module';

@NgModule({
  declarations: [AclAddComponent, AclListComponent, AclFilterComponent, AclDeleteComponent],
  imports: [CeirCommonModule, CeirCoreModule, DualListboxModule, NgxPermissionsModule.forChild({
    permissionsIsolate: true, 
    rolesIsolate: true})],
  providers: [DualBoxService, AclService]
})
export class AclModule {}
