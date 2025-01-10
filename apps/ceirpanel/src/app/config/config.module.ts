import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { ValidateEqualModule } from 'ng-validate-equal';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { routes } from './config.routes';
import { SystemConfigListComponent } from './pages/system.config.list.component';

@NgModule({
  declarations: [SystemConfigListComponent],
  imports: [
    CeirCommonModule,
    ValidateEqualModule,
    RouterModule.forChild(routes),
    NgxPermissionsModule,
    AngularDualListBoxModule
  ],
  exports: [],
  providers: [],
})
export class ConfigModule {}
