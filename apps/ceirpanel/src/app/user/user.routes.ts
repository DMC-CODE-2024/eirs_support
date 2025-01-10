import { Route } from "@angular/router";
import { UserAddComponent } from "./pages/user-add.componenent";
import { UserListComponent } from "./pages/user-list.component";
import { UserGroupListComponent } from "./pages/user-group-list.component";
import { UserGroupAddComponent } from "./pages/user-group-add.component";
import { UserRoleListComponent } from "./pages/user-role-list.component";
import { LoginGuard } from "../core/guards/login.guard";
import { NgxPermissionsGuard } from "ngx-permissions";
import { UserFeatureListComponent } from "./pages/user-feature-list.component";
import { UserMobileEmailVerificationComponent } from "./component/user-mobile-email-verification";

export const routes: Route[] = [
    ...['user/:page/:id', 'user/:page'].map(path => ({
        path, component: UserAddComponent,
        canActivate: [LoginGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['USER_VIEW'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    })),
    {
        path: 'email-mobile-verification/:id/:email/:msisdn', component: UserMobileEmailVerificationComponent
    },
    {
        path: 'user', component: UserListComponent
    },
    {
        path: 'user-group', component: UserGroupListComponent,
        canActivate: [LoginGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['USER-GROUP_VIEW'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    },
    {
        path: 'user-group-advanced/:groupId', component: UserGroupListComponent,
        canActivate: [LoginGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['USER-GROUP_VIEW'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    },
    ...['user-group/:page/:id', 'user-group/:page'].map(path => ({
        path, component: UserGroupAddComponent,
        canActivate: [LoginGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['USER-GROUP_VIEW'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    })),
    {
        path: 'user-role', component: UserRoleListComponent,
        canActivate: [LoginGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['USER-ROLE'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    },
    {
        path: 'user-feature', component: UserFeatureListComponent,
        canActivate: [LoginGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['USER-FEATURE'],
                redirectTo: {
                    default: 'access-denied'
                }
            }
        }
    }
];