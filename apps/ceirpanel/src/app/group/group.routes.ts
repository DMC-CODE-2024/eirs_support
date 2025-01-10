import { Route } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { LoginGuard } from '../core/guards/login.guard';
import { GroupFeatureListComponent } from './pages/group-feature-list.component';
import { GroupRoleAddComponent } from './pages/group-role-add.component';
import { GroupRoleListComponent } from './pages/group-role-list.component';
import { GroupFeatureAddComponent } from './pages/group-feature-add.component';
import { GroupAddComponent } from './pages/group-add.component';
import { GroupAssistentListComponent } from './pages/group-assistent-list.component';

export const routes: Route[] = [
  ...['group/edit/:id', 'group/add'].map((path) => ({
    path,
    component: GroupAddComponent,
    canActivate: [LoginGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['GROUP_VIEW'],
        redirectTo: {
          default: 'access-denied',
        },
      },
    },
  })),
  {
    path: 'group',
    component: GroupAssistentListComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./../user/user.module').then((m) => m.UserModule),
        canActivate: [LoginGuard, NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['GROUP'],
            redirectTo: {
              default: 'access-denied',
            },
          },
        },
      },
      {
        path: 'group-feature-advanced/:groupId',
        component: GroupFeatureListComponent,
        canActivate: [LoginGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['GROUP'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
      },
      {
        path: 'group-role-advanced/:groupId',
        component: GroupRoleListComponent,
        canActivate: [LoginGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['GROUP'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
      },
    ],
  },
  ...['group-role/edit/:id', 'group-role/view/:id', 'group-role/add'].map(
    (path) => ({
      path,
      component: GroupRoleAddComponent,
      canActivate: [LoginGuard, NgxPermissionsGuard],
      data: {
        permissions: {
          only: ['GROUP-ROLE_VIEW'],
          redirectTo: {
            default: 'access-denied',
          },
        },
      },
    })
  ),
  {
    path: 'group-role',
    component: GroupRoleListComponent,
    canActivate: [LoginGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['GROUP-ROLE'],
        redirectTo: {
          default: 'access-denied',
        },
      },
    },
  },
  {
    path: 'group-feature',
    component: GroupFeatureListComponent,
    canActivate: [LoginGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['GROUP-FEATURE'],
        redirectTo: {
          default: 'access-denied',
        },
      },
    },
  },
  ...[
    'group-feature/edit/:id',
    'group-feature/view/:id',
    'group-feature/add',
  ].map((path) => ({
    path,
    component: GroupFeatureAddComponent,
    canActivate: [LoginGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['GROUP-FEATURE_VIEW'],
        redirectTo: {
          default: 'access-denied',
        },
      },
    },
  })),
];
