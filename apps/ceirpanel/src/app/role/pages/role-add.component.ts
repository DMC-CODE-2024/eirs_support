import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm, ClrStepButton, ClrStepper } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { PageType } from '../../core/constants/page.type';
import { AccessModel } from '../../core/models/access.model';
import { AccessEnum, RoleModel } from '../../core/models/role.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { NgForm } from '@angular/forms';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'ceirpanel-role-add',
  template: `
   <div class="card" style="min-height: 85vh;">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-4" style="margin-top: 5px;">
          <h4 class="card-title text-capitalize">{{ "role.pageTitle." + page | translate }}</h4>
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
    <div class="card-block m-1 p-1">
    <form clrStepper clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" (ngSubmit)="f.form.valid && onSubmit(f)">
      <fieldset [disabled]="readonly" class="scheduler-border">
        <legend class="scheduler-border">{{ "role.pageTitle.title" | translate }}</legend>
        <div class="clr-row m-0 p-0">
          <div class="clr-col-6">
            <div class="form-group">
              <label class="form-label clr-required-mark fw-semibold">{{ "role.roleName.label" | translate }}</label>
              <input type="text" name="lastName" class="form-control form-control-sm" [placeholder]="'role.roleName.placeholder' | translate" [(ngModel)]="role.roleName" 
                required #roleName="ngModel" [ngClass]="{ 'is-invalid': f.submitted && roleName.errors }" aria-autocomplete="none"/>
              <div *ngIf="f.submitted && roleName.errors" class="invalid-feedback">
                <div *ngIf="roleName.errors['required']">{{'role.roleName.error.required' | translate}}</div>
              </div>
            </div>
          </div>
          <div class="clr-col-6">
            <div class="form-group">
              <label class="form-label clr-required-mark fw-semibold">{{ "role.access.label" | translate }}</label>
              <select class="form-select form-control form-control-sm" name="access" [(ngModel)]="role.access"
               required #accessModel="ngModel" [ngClass]="{ 'is-invalid': f.submitted && accessModel.errors }">
                <option selected [value]="''">{{ "role.access.placeholder" | translate }}</option>
                <option *ngFor="let access of accesses" [value]="access">{{access}}</option>
              </select>
              <div *ngIf="f.submitted && accessModel.errors" class="invalid-feedback">
                <div *ngIf="accessModel.errors['required']">Access is required</div>
              </div>
            </div>
          </div>
          <div class="clr-col-12 mt-3">
            <div class="form-group">
              <label class="clr--mark">{{ "role.description.label" | translate }}</label>
              <textarea name="address" class="form-control form-control-sm" [placeholder]="'role.description.placeholder' | translate" [(ngModel)]="role.description" aria-autocomplete="none"></textarea>
            </div>
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
export class RoleAddComponent implements OnInit {
  public page: string = '' as string;
  public path: string = '' as string;
  public id: number = 0 as number;
  readonly = false;
  public accesses!: AccessModel[];
  @ViewChild(ClrStepButton, { static: false }) submitButton!: ClrStepButton;
  @ViewChild(ClrStepper, { static: false }) clrStepper!: ClrStepper;
  templateForm: object = { parentGroup: '' } as object;
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
  role: RoleModel = {access: ''} as RoleModel;
  public open = false;
  public cancel = false;

  constructor(
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private apicall: ApiUtilService,
    private transport: MenuTransportService,
    private router: Router) { }

  ngOnInit(): void {
    this.path = this.route.snapshot.url[0].path;
    this.page = this.route.snapshot.paramMap.get('page') || '';
    this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
    if (this.page === PageType.view) { this.readonly = true; }
    this.access();
    if (this.id > 0) {
      this.apicall.get(`/role/${this.id}`).subscribe({
        next: (data) => {
          this.role = data as RoleModel;
        },
        error: (e) => console.log(e),
        complete: () => console.info('complete')
      });
    }
  }
  onSubmit(userForm: NgForm) {
    if (userForm.invalid) { this.clrForm.markAsTouched(); return; }
    this.save();
  }
  save() {
    this.transport.progress = true;
    const observable: Observable<unknown> = this.page == PageType.edit ?
      this.apicall.put(`/role/update/${this.id}`, this.role) : this.apicall.post(`/role/save`, this.role);

    observable.subscribe({
      next: (_data) => {
        console.log('role save: ', (_data as RoleModel).id);
        return this.router.navigate(['/role']);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        setTimeout(() => this.transport.progress = false, 3000);
      }
    });
  }
  access() {
    this.apicall.get('/acl/list').subscribe({
      next: (result) => {
        this.accesses = (result as AccessModel[]);
      },
      error: (e) => {
        console.log('error', e);
      },
      complete: () => {
        console.log('error');
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
}
