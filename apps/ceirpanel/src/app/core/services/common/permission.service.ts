/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { ApiUtilService } from './api.util.service';
import { MenuTransportService } from './menu.transport.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(
    public permission: NgxPermissionsService,
    private roleService: NgxRolesService,
    private apiutil: ApiUtilService,
    public menuTransport: MenuTransportService,
    private jwtService: JwtService
  ) {}
  public load() {
    return new Promise((resolve, reject) => {
      this.apiutil.get('/user/permissions').subscribe({
        next: (data) => {
          this.permission.flushPermissions();
          const acls = data as Array<any>;
          const permissions: string[] = [];
          try {
            acls.forEach((acl) => {
              this.permission.addPermission(acl?.tag?.toUpperCase());
              acl.modules.forEach((p: string) => {
                this.permission.addPermission(
                  acl?.tag?.toUpperCase() + '_' + (p as string).toUpperCase()
                );
                permissions.push(
                  acl?.tag?.toUpperCase() + '_' + (p as string).toUpperCase()
                );
                permissions.push((p as string).toUpperCase());
                this.permission.addPermission((p as string).toUpperCase());
              });
              permissions.push(acl?.tag?.toUpperCase());
            });
            localStorage.setItem(`${this.jwtService.getWindow()}permissions`, JSON.stringify(permissions));
            resolve(permissions);
          } catch (error) {
            reject(null);
          }
        },
        error: (e) => {
          reject(null);
        },
        complete: () => {
          reject(null);
        },
      });  
    });
  }
  
  public loadPermissions() {
    const obj = localStorage.getItem(`${this.jwtService.getWindow()}permissions`) || `[]`;
    const menu = localStorage.getItem(`${this.jwtService.getWindow()}menu`) || '';
    if(!_.isEmpty(obj)) {
      const permissions: string[] = JSON.parse(obj);
      permissions.forEach((p) => this.permission.addPermission(p));
    }
    if (!_.isEmpty(menu)) {
      this.menuTransport.menu = JSON.parse(menu);
    }
  }

  public loadMenu() {
    this.apiutil.get('/feature/permissions').subscribe({
      next: (data) => {
        //console.log(data);
      }
    });
  }
}
