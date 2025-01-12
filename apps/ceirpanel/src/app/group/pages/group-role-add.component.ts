/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm, ClrStepButton, ClrStepper } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, take } from 'rxjs';
import { PageType } from '../../core/constants/page.type';
import { GroupModel } from '../../core/models/group.model';
import { GroupRoleCreateModel } from '../../core/models/group.role.model';
import { RoleModel } from '../../core/models/role.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { GroupRoleDto } from '../dto/group.role.dto';
import { GroupRoleService } from '../service/group.role.service';
import * as _ from "lodash";
import {Location} from '@angular/common';

@Component({
  selector: 'ceirpanel-user-role-add',
  templateUrl: `../html/group-role-add.component.html`,
  styles: [`
  :host ::ng-deep .clr-combobox-wrapper {
    min-width: 95% !important;
  }
  `],
})
export class GroupRoleAddComponent implements OnInit {
    public page: string = '' as string;
    public path: string = '' as string;
    public id: number = 0 as number;
    readonly = false;
    public roles!: RoleModel[];
    selected: RoleModel [] = [];
    @ViewChild(ClrStepButton, { static: false }) submitButton!: ClrStepButton;
    @ViewChild(ClrStepper, { static: false }) clrStepper!: ClrStepper;
    templateForm: object = { parentGroup: '' } as object;
    @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
    role: GroupRoleCreateModel = {group: {}, groupId:0} as GroupRoleCreateModel;
    source!: Array<any>;
    confirmed: Array<any> = [];
    key = 'id';
    display = 'roleName';
    groups: Array<GroupModel> = [];
    public cancel = false;
    public open = false;
  
    constructor(
      private cdref: ChangeDetectorRef,
      private route: ActivatedRoute,
      private translate: TranslateService,
      private apicall: ApiUtilService,
      private transport: MenuTransportService,
      private groupRoleService: GroupRoleService,
      private router: Router,
      public _location: Location) { }
  
    ngOnInit(): void {
      this.path = this.route.snapshot.url[0].path;
      this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
      this.findRoles();
      this.findGroups();
      if (this.id > 0) {
        this.groupRoleService.findByGroupId(this.id).pipe(take(1)).subscribe((data: Array<GroupRoleDto>) => {
          data = _.orderBy(data, item => item.id.roleId, 'asc');
          this.role = {groupId: this.id, roles: data.map(r => r.id.roleId),group:{} as GroupModel};
          data.forEach(d => this.confirmed.push({id: d.id.roleId, displayOrder: 'asc'}));
        });
      }
      this.route.url.subscribe(() => {
        const parent = this.route?.snapshot?.parent?.url[0]?.path;
        this.page = _.split(this.router.url,'/')[2];
        if (this.page === PageType.view) { this.readonly = true; }
       });
    }
    onSubmit(userForm: NgForm) {
      if (userForm.invalid) { this.clrForm.markAsTouched(); return; }
      this.save();
    }
    save() {
      this.transport.progress = true;
      this.role.roles = this.confirmed.map(s => s.id);
      this.role.groupId = this.id;
      const observable: Observable<unknown> = this.page == PageType.edit ?
        this.apicall.put(`/groupRole/update/${this.id}`, this.role) : this.apicall.post(`/groupRole/save`, this.role);
  
      observable.subscribe({
        next: (_data) => {
          return this.router.navigate(['/group-role']);
        },
        complete: () => {
          setTimeout(() => this.transport.progress = false, 3000);
        }
      });
    }
    findRoles() {
      this.apicall.get('/role/list').subscribe({
        next: (result) => {
          this.roles = (result as RoleModel[]);
        }
      });
    }
    findGroups() {
      this.apicall.get('/group/list').subscribe({
        next: (result) => {
          this.groups = (result as GroupModel[]);
        }
      });
    }
    openClose(open: boolean) {
      this.open = open;
    }
    cancelOpenClose(cancel: boolean) {
      this.cancel = false;
      if(cancel == true)this.router.navigate([this.path]);
    }
    onGroupChange($event: any) {
      this.id = $event.target.value;
      this.groupRoleService.findByGroupId(this.id).pipe(take(1)).subscribe((data: Array<GroupRoleDto>) => {
        data = _.orderBy(data, item => item.id.roleId, 'asc');
        this.role = {groupId: this.id, roles: data.map(r => r.id.roleId),group:{} as GroupModel};
        data.forEach(d => this.confirmed.push({id: d.id.roleId, displayOrder: 'asc'}));
      });
    }
  }
