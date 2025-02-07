import { CommonModule } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AngularResizeEventModule } from 'angular-resize-event';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AccessDeniedComponent } from '../core/components/access-denied.component';
import { RegionDeniedComponent } from '../core/components/region-denied.component';
import { CancelComponent } from '../core/components/cancel.component';
import { ConfirmationComponent } from '../core/components/confirmation.component';
import { ListActionComponent } from '../core/components/list-action.component';
import { LoginGuard } from '../core/guards/login.guard';
import { Includes } from '../core/pipe/include.pipe';
import { SortByOrderPipe } from '../core/pipe/sort.pipe';
import { ApiUtilService } from '../core/services/common/api.util.service';
import { AuthService } from '../core/services/common/auth.service';
import { CustomvalidationService } from '../core/services/common/customvalidation.service';
import { ExportService } from '../core/services/common/export.service';
import { JwtService } from '../core/services/common/jwt.service';
import { MenuTransportService } from '../core/services/common/menu.transport.service';
import { UploadService } from '../core/services/common/upload.service';
import { AppAlertComponent } from './app.alert.component';
import { CeirHeaderComponent } from './ceir-header.component';
import { DropdownSidebarComponent } from './dropdown.sidebar.component';
import { FilterComponent } from './filter.component';
import { SidebarComponent } from './sidebar.component';
import { TreeSidebarComponent } from './tree.sidebar.component';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/en-CA';
import { AlertComponent } from '../core/components/alert.component';
import { RegionServiceNotAvailableComponent } from '../core/components/region-service-not-available.component';

registerLocaleData(localeFr);

export function appInit(apiutil: ApiUtilService) {
  return () => apiutil.loadMenu('vivesha');
}

@NgModule({
  declarations: [
    CeirHeaderComponent, SidebarComponent, 
    DropdownSidebarComponent, TreeSidebarComponent, 
    ConfirmationComponent, FilterComponent, CancelComponent, ListActionComponent,
    AccessDeniedComponent, Includes, AppAlertComponent, SortByOrderPipe, AlertComponent, 
    RegionDeniedComponent, RegionServiceNotAvailableComponent
  ],
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    ClarityModule,
    NgbModule,
    TranslateModule,
    RouterModule,
    AngularResizeEventModule,
    NgImageSliderModule,
    NgxPermissionsModule
  ],
  exports: [
    FormsModule,
    NgImageSliderModule, 
    CeirHeaderComponent, 
    CommonModule, 
    ClarityModule, 
    NgbModule,
    SidebarComponent, 
    RouterModule, 
    ConfirmationComponent,
    TranslateModule,
    FilterComponent,
    CancelComponent,
    ListActionComponent,
    AppAlertComponent,
    AlertComponent
  ],
  providers: [
    ApiUtilService,
    MenuTransportService,
    AuthService,
    CustomvalidationService,
    ExportService,
    UploadService,
    JwtService,
    LoginGuard,
    { provide: LOCALE_ID, useValue: 'en-CA' }
  ]
})
export class CeirCommonModule {
  
}
