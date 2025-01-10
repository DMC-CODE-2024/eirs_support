import { NgModule } from '@angular/core';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { CeirCoreModule } from '../core/core.module';
import { GroupDeleteComponent } from './component/group-delete.component';
import { GroupFilterComponent } from './component/group-filter.component';
import { GroupAddComponent } from './pages/group-add.component';
import { GroupListComponent } from './pages/group-list.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GroupAssistentListComponent } from './pages/group-assistent-list.component';
import { GroupRoleListComponent } from './pages/group-role-list.component';
import { routes } from './group.routes';
import { RouterModule } from '@angular/router';
import { GroupRoleAddComponent } from './pages/group-role-add.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { GroupRoleDeleteComponent } from './component/group-role-delete.component';
import { GroupFeatureDeleteComponent } from './component/group-feature-delete.component';
import { GroupFeatureListComponent } from './pages/group-feature-list.component';
import { GroupFeatureAddComponent } from './pages/group-feature-add.component';
import { DualListboxModule } from '@ceirpanel/dual-listbox';

@NgModule({
  declarations: [
    GroupListComponent, 
    GroupAddComponent, 
    GroupFilterComponent, 
    GroupDeleteComponent,
    GroupAssistentListComponent,
    GroupRoleListComponent,
    GroupRoleAddComponent,
    GroupRoleDeleteComponent,
    GroupFeatureDeleteComponent,
    GroupFeatureListComponent,
    GroupFeatureAddComponent
  ],
  imports: [
    CeirCommonModule, CeirCoreModule, 
    NgxPermissionsModule.forChild({permissionsIsolate: true, rolesIsolate: true}),
    RouterModule.forChild(routes),
    AngularDualListBoxModule,
    DualListboxModule
  ],
})
export class GroupModule {}
