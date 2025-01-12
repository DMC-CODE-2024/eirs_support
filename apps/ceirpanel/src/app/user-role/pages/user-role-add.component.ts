/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm, ClrStepButton, ClrStepper } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, take } from 'rxjs';
import { PageType } from '../../core/constants/page.type';
import { RoleModel } from '../../core/models/role.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { UserRoleCreateModel, UserRoleModel } from '../../core/models/user.role.model';
import { UserModel } from '../../core/models/user.model';
import { UserRoleService } from '../../user/service/user.role.service';
import { UserRoleDto } from '../../user/dto/user.role.dto';

@Component({
  selector: 'ceirpanel-user-role-add',
  template: `
   <div class="card" style="min-height: 85vh;">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-4" style="margin-top: 5px;">
          <h4 class="card-title text-capitalize">{{ "userRole.pageTitle." + page | translate }}</h4>
        </div>
        <div class="clr-col-4 text-right" style="padding-right: 0.1rem">
          <div class="btn-group btn-primary text-right">
            <button class="btn" aria-label="Check" routerLink="/role">
              <i class="bi bi-arrow-left-circle"></i> {{ "button.back" | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="card-block m-0 p-0">
    <form clrStepper clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" (ngSubmit)="f.form.valid && onSubmit(f)" autocomplete="off">
      <fieldset [disabled]="readonly" class="scheduler-border">
        <legend class="scheduler-border">User Role Information</legend>
        <div class="clr-row m-0 p-0">
          <div class="clr-col-6 m-0 p-0">
            <div class="form-group">
              <label class="clr-required-mark">{{ "userRole.userId.label" | translate }}</label>
              <select class="form-select form-control form-control-sm" name="userId" [(ngModel)]="role.user.id" required
               #userId="ngModel" [ngClass]="{ 'is-invalid': f.submitted && userId.errors }" (change)="onUserChange($event)">
                <option selected [value]="'0'">{{ "userRole.userId.placeholder" | translate }}</option>
                <option *ngFor="let user of users" [value]="user.id">{{user?.userName}}</option>
              </select>
              <div *ngIf="f.submitted && userId.errors" class="invalid-feedback">
                <div *ngIf="userId.errors['required']">{{'userRole.userId.error' | translate}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="clr-row m-0 p-0 mt-3">
          <div class="clr-col-12 m-0 p-0" style="margin-top:20px;">
            <dual-list [source]="roles" [(destination)]="confirmed" [key]="key" [display]="display" [filter]="false" height="350"></dual-list>
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
  :host ::ng-deep .clr-combobox-wrapper {
    min-width: 95% !important;
  }
  `],
})
export class UserRoleAddComponent implements OnInit {
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
  role: UserRoleCreateModel = {user: {id: 0}} as UserRoleCreateModel;
  source!: Array<any>;
  confirmed: Array<any> = [];
  key = 'id';
  display = 'roleName';
  users: Array<UserModel> = [];
  public open = false;
  public cancel = false;

  constructor(
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private apicall: ApiUtilService,
    private transport: MenuTransportService,
    private router: Router,
    private userRoleService: UserRoleService) { }

  ngOnInit(): void {
    this.path = this.route.snapshot.url[0].path;
    this.page = this.route.snapshot.paramMap.get('page') || '';
    this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
    if (this.page === PageType.view) { this.readonly = true; }
    this.findRoles();
    this.findUsers();
    if (this.id > 0) {
      this.userRoleService.view(this.id).pipe(take(1)).subscribe((data: Array<UserRoleDto>) => {
        this.role = {userId: this.id, roles: data.map(r => r.role.id),user: {id: this.id} as UserModel};
        this.confirmed = data.map(r => r.role);
      });
    }
  }
  onSubmit(userForm: NgForm) {
    if (userForm.invalid) { this.clrForm.markAsTouched(); return; }
    this.save();
  }
  save() {
    this.transport.progress = true;
    this.role.roles = this.confirmed.map(s => s.id);
    this.role.userId = this.role.user.id;
    const observable: Observable<unknown> = this.page == PageType.edit ?
      this.apicall.put(`/userRole/update/${this.id}`, this.role) : this.apicall.post(`/userRole/save`, this.role);

    observable.subscribe({
      next: (_data) => {
        return this.router.navigate(['/user-role']);
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
  findUsers() {
    this.apicall.get('/user/list').subscribe({
      next: (result) => {
        this.users = (result as UserModel[]);
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
  onUserChange($event: any) {
    this.id = $event.target.value;
    this.userRoleService.view(this.id).pipe(take(1)).subscribe((data: Array<UserRoleDto>) => {
      this.role = {userId: this.id, roles: data.map(r => r.role.id),user: {id: this.id} as UserModel};
      this.confirmed = data.map(r => r.role);
    });
  }
}
