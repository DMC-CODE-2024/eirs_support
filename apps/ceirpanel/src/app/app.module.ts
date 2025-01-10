/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DOCUMENT
} from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import * as _ from 'lodash';
import { ConfigService, bootConfigServiceProvider } from 'ng-config-service';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { AclModule } from './acl/acl-module.module';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login.component';
import { CeirCommonModule } from './ceir-common/ceir-common.module';
import { CeirCoreModule } from './core/core.module';
import { interceptorProviders } from './core/interceptors/interceptors';
import { DEFAULT_TIMEOUT } from './core/interceptors/request-time.interceptor';
import { ApiUtilService } from './core/services/common/api.util.service';
import { PermissionService } from './core/services/common/permission.service';
import { DeviceModule } from './device/device.module';
import { FeatureModuleModule } from './feature-module/feature-module.module';
import { FeatureModule } from './feature/feature.module';
import { GroupFeatureModule } from './group-feature/group-feature.module';
import { GroupRoleModule } from './group-role/group-role.module';
import { GroupModule } from './group/group.module';
import { ModuleMangeModule } from './module-manage/module.mange.module';
import { RoleModule } from './role/role.module';
import { TagModule } from './tag/tag.module';
import { UserFeatureModule } from './user-feature/group-feature.module';
import { UserGroupModule } from './user-group/user-group.module';
import { UserRoleModule } from './user-role/user-role.module';



export function appInit(apiutil: ApiUtilService) {
  return () => apiutil.loadMenu('vivesha');
}
export function initPermission(permission: NgxPermissionsService) {
  const obj = localStorage.getItem('permissions');
  console.log('permission: ', permission);
  if (obj) {
    const permissions: string[] = JSON.parse(obj);
    permissions.forEach((p) => permission.addPermission(p));
  }
}
export function HttpLoaderFactory(
  http: HttpClient,
  document: any,
  config: ConfigService
) {
  const langurl = _.isEmpty(config.get('api'))
    ? `${document.location.protocol}//${document.location.host}/language/`
    : `${config.get('api')}/language/`;
  return new TranslateHttpLoader(http, langurl, '.json?t=' + new Date());
}
@NgModule({
  declarations: [AppComponent, AuthComponent, LoginComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CeirCoreModule,
    CeirCommonModule,
    DeviceModule,
    GroupModule,
    RoleModule,
    UserRoleModule,
    GroupRoleModule,
    FeatureModule,
    FeatureModuleModule,
    GroupFeatureModule,
    UserFeatureModule,
    UserGroupModule,
    TagModule,
    AclModule,
    ModuleMangeModule,
    TranslateModule.forRoot({
      defaultLanguage: 'us',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, DOCUMENT, ConfigService],
      },
    }),
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking', useHash: false }),
    NgxPermissionsModule.forRoot(),
    RecaptchaModule,
    RecaptchaFormsModule,
    NgbModule
  ],
  exports: [CeirCommonModule, TranslateModule, CeirCoreModule],
  providers: [
    bootConfigServiceProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: () => appInit,
      multi: true,
      deps: [ApiUtilService],
    },
    interceptorProviders,
    { provide: DEFAULT_TIMEOUT, useValue: 60000 },
    //{provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(permission: PermissionService) {
    permission.loadPermissions();
  }
}
