 import { ActivatedRouteSnapshot, Route, RouterStateSnapshot } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AclAddComponent } from './acl/pages/acl-add.component';
import { AclListComponent } from './acl/pages/acl-list.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login.component';
import { AccessDeniedComponent } from './core/components/access-denied.component';
import { LoginGuard } from './core/guards/login.guard';
import { NotLoginGuard } from './core/guards/not-login.guard';
import { DeviceAddComponent } from './device/device-add.component';
import { DeviceListComponent } from './device/device-list.component';
import { FeatureModuleAddComponent } from './feature-module/pages/feature-module-add.component';
import { FeatureModuleListComponent } from './feature-module/pages/feature-module-list.component';
import { FeatureAddComponent } from './feature/pages/feature-add.component';
import { FeatureListComponent } from './feature/pages/feature-list.component';
import { ImeiComponent } from './imei/imei.component';
import { ModuleAddComponent } from './module-manage/pages/module-add.component';
import { ModuleListComponent } from './module-manage/pages/module-list.component';
import { RoleAddComponent } from './role/pages/role-add.component';
import { RoleListComponent } from './role/pages/role-list.component';
import { TagAddComponent } from './tag/pages/tag-add.component';
import { TagListComponent } from './tag/pages/tag-list.component';
import { UserFeatureAddComponent } from './user-feature/pages/user-feature-add.component';
import { UserRoleAddComponent } from './user-role/pages/user-role-add.component';
import { ChangePasswordComponent } from './user/pages/change.password.component';
import { RegionDeniedComponent } from './core/components/region-denied.component';


export const appRoutes: Route[] = [
    {path: '', component: AuthComponent},
    {path: 'imei', component: ImeiComponent},
    {path: 'login', component: AuthComponent, canActivate: [NotLoginGuard]},
    {path: 'login-new', component: LoginComponent},
    {path: 'device', component: DeviceListComponent},
    {path: 'device/add', component: DeviceAddComponent},
    {
        path: '', 
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        canActivate: [LoginGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['USER_VIEW'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    },
    {
        path: '', 
        loadChildren: () => import('./grievance/grievance.module').then(m => m.GrievanceModule)
    },
    {
        path: 'config', 
        loadChildren: () => import('./config/config.module').then(m => m.ConfigModule)
    },
    {
        path: 'change-password', component: ChangePasswordComponent
    },
    {
        path: '',
        loadChildren: () => import('./group/group.module').then(m => m.GroupModule)
    },
    {
        path: 'tag', component: TagListComponent,
        canActivate: [LoginGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['TAG'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    },
    ...['tag/:page/:id', 'tag/:page'].map(path => ({
        path, component: TagAddComponent,
        canActivate: [LoginGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['TAG_VIEW'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    })),
    {
        path: 'module', component: ModuleListComponent,
        canActivate: [LoginGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['MODULE'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    },
    ...['module/:page/:id', 'module/:page'].map(path => ({
        path, component: ModuleAddComponent,
        canActivate: [LoginGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['MODULE_VIEW'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    })),
    {
        path: 'role', component: RoleListComponent,
        canActivate: [LoginGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ROLE'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    },
    ...['role/:page/:id', 'role/:page'].map(path => ({
        path, component: RoleAddComponent,
        canActivate: [LoginGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ROLE_VIEW'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    })),
    ...['user-role/:page/:id', 'user-role/:page'].map(path => ({
        path, component: UserRoleAddComponent,
        canActivate: [LoginGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['USER-ROLE_VIEW'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    })),
    ...['user-feature/:page/:id', 'user-feature/:page'].map(path => ({
        path, component: UserFeatureAddComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['USER-FEATURE_VIEW'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    })),
    {
        path: 'feature-module', component: FeatureModuleListComponent,
        
    },
    ...['feature-module/:page/:id', 'feature-module/:page'].map(path => ({
        path, component: FeatureModuleAddComponent,
        
    })),
    {
        path: 'feature', component: FeatureListComponent,
        canActivate: [LoginGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['FEATURE'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    },
    ...['feature/:page/:id', 'feature/:page'].map(path => ({
        path, component: FeatureAddComponent,
        canActivate: [LoginGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['FEATURE_VIEW'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    })),
    {
        path: 'acl', component: AclListComponent,
        canActivate: [LoginGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ACL'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    },
    ...['acl/:page/:id', 'acl/:page'].map(path => ({
        path, component: AclAddComponent
    })),
    {path: 'access-denied', component: AccessDeniedComponent},
    {path: 'region-denied', component: RegionDeniedComponent}
];
