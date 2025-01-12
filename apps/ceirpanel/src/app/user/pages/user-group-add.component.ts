/* eslint-disable @typescript-eslint/no-explicit-any */
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm } from '@clr/angular';
import * as _ from "lodash";
import { Observable, concat, take } from 'rxjs';
import { PageType } from '../../core/constants/page.type';
import { GroupModel } from '../../core/models/group.model';
import { UserGroupCreateModel } from '../../core/models/user.group.model';
import { UserModel } from '../../core/models/user.model';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { UserGroupDto } from '../../user-group/dto/user-group.dto';
import { UserGroupService } from '../service/user.group.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'ceirpanel-user-group-add',
  template: `
  <div class="card" style="min-height: 85vh;">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-4" style="margin-top: 5px;">
          <h4 class="card-title text-capitalize">{{ "userGroup.pageTitle." + page | translate }}</h4>
        </div>
        <div class="clr-col-4 text-right" style="padding-right: 0.1rem">
          <div class="btn-group btn-primary text-right">
            <button class="btn" aria-label="Check" (click)="_location.back()">
              <i class="bi bi-arrow-left-circle"></i> {{ "button.back" | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="card-block m-1 p-1">
    <form clrStepper clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" (ngSubmit)="f.form.valid && onSubmit(f)" autocomplete="off">
      <fieldset [disabled]="readonly" class="scheduler-border">
        <legend class="scheduler-border">{{ "userGroup.pageTitle.title" | translate }}</legend>
        <div class="clr-row m-0 p-0">
          <div class="clr-col-12 m-0 p-0">
            <div class="form-group" *ngIf="users.length>0">
              <label class="clr-required-mark">{{ "userGroup.userId.label" | translate }}</label>
              <ng-multiselect-dropdown
                [placeholder]="'userGroup.userId.placeholder' | translate"
                [settings]="dropdownSettings"
                [data]="users"
                [(ngModel)]="selectedUsers"
                (onSelect)="onUserSelect($event)"
                (onSelectAll)="onUserSelectAll($event)"
                (onDeSelect)="onUserDeSelect($event)"
                name="userId"
                #groupId="ngModel" [ngClass]="{ 'is-invalid': f.submitted && groupId.errors }"
                required
              >
              </ng-multiselect-dropdown>
              <div *ngIf="f.submitted && groupId.errors" class="invalid-feedback">
                <div *ngIf="groupId.errors['required']">{{'userGroup.user.error.required' | translate}}</div>
              </div>
            </div>

          </div>
          <div class="clr-col-12 m-0 p-0">
            <table class="table table-vertical table-compact shadow-none m-0 p-0 mt-1">
              <tbody class="shadow-none">
                <tr *ngFor="let item of usermap | keyvalue" class="shadow-none">
                  <th>{{item.key}}</th>
                  <td *ngFor="let g of item.value" class="shadow-none">{{g?.group?.groupName}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="clr-row m-0 p-0 mt-2">
          <div class="clr-col-12 m-0 p-0" style="margin-top:20px;">
            <ceirpanel-dual-list [source]="(groups | async) || []" [(destination)]="confirmed" [key]="'id'" [display]="'groupName'" height="250"></ceirpanel-dual-list>
          </div>
        </div>
        <div class="clr-row clr-justify-content-end mt-3">
          <div class="clr-col-2">
            <button type="submit" class="btn btn-primary btn-block">{{ "button.save" | translate }}</button>
          </div>
          <div class="clr-col-2">
            <button type="button" class="btn btn-outline btn-block" (click)="cancel=true">{{ "button.cancel" | translate }}</button>
          </div>
        </div>
      </fieldset>
    </form>
    </div>
   </div>
   <ceirpanel-ceir-cancel [open]="cancel" (confirmation)="cancelOpenClose($event)"></ceirpanel-ceir-cancel>
  `,
  styles: [`
  :host ::ng-deep .multiselect-dropdown[_ngcontent-ng-c1411523848] 
  .dropdown-btn[_ngcontent-ng-c1411523848] .selected-item-container[_ngcontent-ng-c1411523848] 
  .selected-item[_ngcontent-ng-c1411523848] {
    border: 1px solid #337ab7;
    margin-right: 4px;
    background: #337ab7;
    padding: 0 2px;
    color: #fff;
    border-radius: 2px;
    float: left;
    max-width: none;
}
tbody, td, tfoot, th, thead, tr {
    border-style: none !important;
}
  `],
})
export class UserGroupAddComponent implements OnInit {
  public page: string = '' as string;
  public path: string = '' as string;
  public id: number = 0 as number;
  public groups!: Observable<Array<GroupModel>>;
  public users: any[] = [];
  public readonly = false;
  public userGroupFeature: UserGroupCreateModel = {
    user: { id: 0 },
  } as UserGroupCreateModel;
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
  confirmed: Array<any> = [];
  public open = false;
  public cancel = false;
  selectedUsers = [];
  usermap = new Map<string, Array<UserGroupDto>>();;
  dropdownSettings = {
    idField: 'id',
    textField: 'userName',
    selectAllText: 'Select Users',
    allowSearchFilter: true
  };
  
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public transport: MenuTransportService,
    private userGroupService: UserGroupService,
    public _location: Location
  ) {}

  ngOnInit(): void {
    this.path = this.route.snapshot.url[0].path;
    this.page = this.route.snapshot.paramMap.get('page') || '';
    this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
    this.groups = this.userService.groups();
    if(!_.isNull(this.route.snapshot.queryParamMap.get('users'))) {
      this.selectedUsers = JSON.parse(this.route.snapshot.queryParamMap.get('users') as any);
      this.getUsers(this.selectedUsers.map((u:any) => u.id));
    }
    if (this.id > 0) {
      this.getUser(this.id);
    } else {
      this.userService.users().pipe(take(1)).subscribe(users => this.users = users);
    }
    this.readonly = this.page === PageType.view  ? true : false;
  }

  onSubmit(userForm: NgForm) {
    if (userForm.invalid) {
      this.clrForm.markAsTouched();
      return;
    }
    this.save();
  }

  save() {
    if(this.selectedUsers.length == 1) {
      this.transport.progress = true;
      this.confirmed = _.orderBy(this.confirmed, ['displayOrder'], ['asc']);
      this.userGroupFeature.groupmap = this.confirmed.map((s, index) => {
        return {groupId: s.id, displayOrder: index};
      });
      this.userGroupFeature.userId = (this.selectedUsers[0] as any).id;
      const observable: Observable<unknown> =
        this.page == PageType.edit
          ? this.userService.saveusergroup(this.userGroupFeature)
          : this.userService.updateusergroup(this.userGroupFeature.userId, this.userGroupFeature);
      observable.pipe(take(1)).subscribe(() => {
        setTimeout(() => (this.transport.progress = false), 3000);
        return this.router.navigate(['/user-group']);
      });
    } else {
      this.saveAll();
    }
  }
  saveAll() {
    this.transport.progress = true;
    this.userGroupFeature.groups = this.confirmed.map((s) => s.id);
    const groupmap = this.confirmed.map((s, index) => {
      return {groupId: s.id, displayOrder: index};
    });
    const httpReqs = this.selectedUsers.map((user: any) => 
      this.userService.updateusergroup(user.id, {userId: user.id, groupmap} as UserGroupCreateModel)
    );
    concat(...httpReqs).pipe(take(this.selectedUsers.length)).subscribe(() => {
      setTimeout(() => (
        this.transport.progress = false), 3000);
        return this.router.navigate(['/user-group']);
    });
  }
  
  openClose(open: boolean) {
    this.open = open;
  }

  cancelOpenClose(cancel: boolean) {
    this.cancel = false;
    if (cancel == true) this.router.navigate([this.path]);
  }
  onUserChange($event: any) {
    this.id = $event.target.value;
    this.getUser(this.id);
  }
  getUser(id: number) {
    this.userGroupService.findByUserId(id).pipe(take(1)).subscribe((data: Array<UserGroupDto>) => {
      data = _.sortBy(data, ['displayOrder'], 'asc');
      this.userGroupFeature = {userId: this.id, groups: data.map(r => r.id.groupId),groupmap:[],user:{id:this.id} as UserModel};
      data.forEach(d => this.confirmed.push({id: d.id.groupId, displayOrder: 'asc'}));
      this.selectedUsers.push({id,userName: data[0].user.userName} as never);
      this.userService.users().pipe(take(1)).subscribe(users => this.users = users);
    });
  }
  getUsers(ids: Array<number>) {
    this.userGroupService.findByUserIds(ids).pipe(take(1)).subscribe((data: Array<UserGroupDto>) => {
      data = _.sortBy(data, ['displayOrder'], 'asc');
      this.confirmed = [];
      this.usermap.clear();
      if(ids.length==1) {
        this.userGroupFeature = {userId: this.id, groups: data.map(r => r.id.groupId),groupmap:[],user:{id:this.id} as UserModel};
        data.forEach(d => this.confirmed.push({id: d.id.groupId, displayOrder: 'asc'}));
      } else {
        data.forEach(d => this.confirmed.push({id: d.id.groupId, displayOrder: 'asc'}));
        this.userGroupFeature = {userId: this.id, groups: data.map(r => r.id.groupId),groupmap:[],user:{id:this.id} as UserModel};
      }
      this.confirmed = _.sortBy(this.confirmed, ['displayOrder'], 'asc');
      this.confirmed =_.uniqBy(this.confirmed, (obj) => obj.id);
      const result = _.mapValues(_.groupBy(data, 'id.userId'), clist => clist.map(d => _.omit(d, 'id.userId')));
      Object.keys(result).forEach(key => {
        this.usermap.set(this.getUserName(key), result[key]);
      })
    });
  }
  onUserSelect(user: any){
    this.getUsers(this.selectedUsers.map((r:any) => r.id));
  }
  onUserSelectAll(users: any){
    this.selectedUsers = users;
    this.getUsers(this.selectedUsers.map((r:any) => r.id));
  }
  onUserDeSelect(user: any){
    this.getUsers(this.selectedUsers.map((r:any) => r.id));
  }
  getUserName(id: string) {
    return (_.find(this.selectedUsers,{id: Number(id)}) as any)?.userName;
  }
}
