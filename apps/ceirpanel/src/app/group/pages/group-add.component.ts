import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm, ClrStepButton, ClrStepper } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { PageType } from '../../core/constants/page.type';
import { NgForm } from '@angular/forms';
import { GroupModel } from '../../core/models/group.model';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { Observable } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionService } from '../../core/services/common/permission.service';

@Component({
  selector: 'ceirpanel-group-add',
  template: `
   <div class="card" style="min-height: 85vh;">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-4" style="margin-top: 5px;">
          <h4 class="card-title text-capitalize">{{ "group.pageTitle." + page | translate }}</h4>
        </div>
        <div class="clr-col-4 text-right" style="padding-right: 0.1rem">
          <div class="btn-group btn-primary text-right">
            <button class="btn" aria-label="Check" routerLink="/group">
              <i class="bi bi-arrow-left-circle"></i> {{ "button.back" | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="card-block">
      <form clrStepper clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" (ngSubmit)="f.form.valid && onSubmit(f)">
        <fieldset [disabled]="readonly" class="scheduler-border">
          <legend class="scheduler-border">{{ "group.pageTitle.title" | translate }}</legend>
          <div class="clr-row m-0 p-0 mt-2">
            <div class="clr-col-6">
              <div class="form-group">
                <label>{{ "group.parentGroup.label" | translate }}</label>
                <select class="form-select form-control form-control-sm" name="parent" [(ngModel)]="group.parent.id">
                  <option selected [value]="'0'">{{ "group.parentGroup.placeholder" | translate }}</option>
                  <option *ngFor="let group of groups;" [value]="group.id">{{group?.groupName}}</option>
                </select>
              </div>
            </div>
            <div class="clr-col-6">
              <div class="form-group">
                <label for="groupName" class="form-label clr-required-mark fw-semibold">{{'group.groupName.label' | translate}}</label>
                <input type="text" name="groupName" class="form-control form-control-sm" id="groupName" [(ngModel)]="group.groupName" required
                  [placeholder]="'group.groupName.placeholder' | translate" #groupName="ngModel" [ngClass]="{ 'is-invalid': f.submitted && groupName.errors }" aria-autocomplete="none">
                <div *ngIf="f.submitted && groupName.errors" class="invalid-feedback">
                  <div *ngIf="groupName.errors['required']">{{'group.groupName.error.required' | translate}}</div>
                </div>
              </div>
            </div>
            <div class="clr-col-12 mt-2">
              <div class="form-group">
                <label for="description" class="form-label fw-semibold">{{'group.description.label' | translate}}</label>
                <textarea class="form-control" name="description" class="form-control form-control-sm" id="description" [(ngModel)]="group.description"
                  [placeholder]="'group.description.placeholder' | translate"></textarea>
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
   <ceirpanel-ceir-confirmation [open]="open" (confirmation)="openClose($event)"></ceirpanel-ceir-confirmation>
   <ceirpanel-ceir-cancel [open]="cancel" (confirmation)="cancelOpenClose($event)"></ceirpanel-ceir-cancel>
  `,
  styles: [`
  :host ::ng-deep .clr-combobox-wrapper {
    min-width: 95% !important;
  }
  `],
})
export class GroupAddComponent implements OnInit {
  public page: string = '' as string;
  public path: string = '' as string;
  public id: number = 0 as number;
  readonly = false;
  @ViewChild(ClrStepButton, { static: false }) submitButton!: ClrStepButton;
  @ViewChild(ClrStepper, { static: false }) clrStepper!: ClrStepper;
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
  templateForm: object = {parentGroup: ''} as object;
  group: GroupModel = {parent:{id:0}} as GroupModel;
  groups: Array<GroupModel> = [];
  public open = false;
  public cancel = false;
  public delete = false;

  constructor(
    private cdref: ChangeDetectorRef, 
    private route: ActivatedRoute, 
    private translate: TranslateService,
    private apicall: ApiUtilService,
    private router: Router,
    private transport: MenuTransportService,
    public permissionService: NgxPermissionsService,
    private permission: PermissionService) {
      
  }

  ngOnInit(): void {
    this.path = this.route.snapshot.url[0].path;
    this.page = this.route.snapshot.paramMap.get('page') || 'add';
    this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
    if (this.page === PageType.view) {
      this.readonly = true;
    }
    this.findGroups();
    if (this.id > 0) {
      this.apicall.get(`/group/${this.id}`).subscribe({
        next: (data) => {
          this.group = data as GroupModel;
        }
      });
    }
  }
  onSubmit(userForm: NgForm) {
    if (userForm.invalid) { this.clrForm.markAsTouched(); return; }
    this.save();
  }
  save() {
    this.transport.progress = true;
    this.group.parentGroupId = this.group.parent ?  this.group.parent.id: 0;
    const observable: Observable<unknown> = this.page == PageType.edit ? 
      this.apicall.put(`/group/update/${this.id}`, this.group) : this.apicall.post(`/group/save`, this.group);

      observable.subscribe({
      next: (_data) => {
        return this.router.navigate(['/group']);
      },
      complete: () => {
        setTimeout(() => this.transport.progress = false, 3000);
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
}
