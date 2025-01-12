import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm, ClrStepButton, ClrStepper } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { PageType } from '../../core/constants/page.type';
import { NgForm } from '@angular/forms';
import { GroupModel } from '../../core/models/group.model';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { TagModel } from '../../core/models/tag.model';
import { Observable } from 'rxjs';
import { ModuleMangeModel } from '../../core/models/module.manage.model';

@Component({
  selector: 'ceirpanel-module-add',
  template: `
   <div class="card" style="min-height: 85vh;">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-4" style="margin-top: 5px;">
          <h4 class="card-title text-capitalize">{{ "module.pageTitle." + page | translate }}</h4>
        </div>
        <div class="clr-col-4 text-right" style="padding-right: 0.1rem">
          <div class="btn-group btn-primary text-right">
            <ng-template [ngxPermissionsOnly]="['MODULE']">
              <button class="btn" aria-label="Check" routerLink="/module">
                <i class="bi bi-arrow-left-circle"></i> {{ "button.back" | translate }}
              </button>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
    <div class="card-block m-1 p-1">
    <form clrStepper clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" (ngSubmit)="f.form.valid && onSubmit(f)">
      <fieldset [disabled]="readonly" class="scheduler-border">
        <legend class="scheduler-border">{{ "module.pageTitle.title" | translate }}</legend>
        <div class="clr-row m-0 p-0">
          <div class="clr-col-6">
            <div class="form-group">
              <label class="clr-required-mark">{{ "module.moduleName.label" | translate }}</label>
              <input type="text" name="moduleName" class="form-control form-control-sm" id="moduleName" [(ngModel)]="module.moduleName" required
                [placeholder]="'module.moduleName.placeholder' | translate" #moduleName="ngModel" [ngClass]="{ 'is-invalid': f.submitted && moduleName.errors }">
              <div *ngIf="f.submitted && moduleName.errors" class="invalid-feedback">
                <div *ngIf="moduleName.errors['required']">{{'module.moduleName.error.required' | translate}}</div>
              </div>
            </div>
          </div>
          <div class="clr-col-6">
            <div class="form-group">
              <label>{{ "tag.moduleTagName.label" | translate }}</label>
              <select class="form-select form-control form-control-sm" name="moduleTag" [(ngModel)]="module.moduleTag.id">
                <option selected [value]="'0'">{{ "tag.moduleTagName.placeholder" | translate }}</option>
                <option *ngFor="let tag of tags" [value]="tag.id">{{tag?.moduleTagName}}</option>
              </select>
            </div>
          </div>
          <div class="clr-col-12 mt-3">
            <div class="form-group">
              <label class="clr--mark">{{ "module.description.label" | translate }}</label>
              <textarea type="text" name="description" class="form-control form-control-sm" id="description" [(ngModel)]="module.description"
                [placeholder]="'module.description.placeholder' | translate"></textarea>
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
export class ModuleAddComponent implements OnInit {
  public page: string = '' as string;
  public path: string = '' as string;
  public id: number = 0 as number;
  readonly = false;
  @ViewChild(ClrStepButton, { static: false }) submitButton!: ClrStepButton;
  @ViewChild(ClrStepper, { static: false }) clrStepper!: ClrStepper;
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
  templateForm: object = {} as object;
  module: ModuleMangeModel = {moduleTag: {id: 0}} as ModuleMangeModel;
  tags: Array<TagModel> = [];
  public open = false;
  public cancel = false;
  public delete = false;

  constructor(
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private apicall: ApiUtilService,
    private router: Router,
    private transport: MenuTransportService) { }

  ngOnInit(): void {
    this.path = this.route.snapshot.url[0].path;
    this.page = this.route.snapshot.paramMap.get('page') || '';
    this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
    if (this.page === PageType.view) {
      this.readonly = true;
    }
    this.findTags();
    if (this.id > 0) {
      this.apicall.get(`/module/${this.id}`).subscribe({
        next: (data) => {
          this.module = data as ModuleMangeModel;
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
    if(this.module.moduleTag) this.module.moduleTagId = this.module.moduleTag.id;
    const observable: Observable<unknown> = this.page == PageType.edit ? 
      this.apicall.put(`/module/update/${this.id}`, this.module) : this.apicall.post(`/module/save`, this.module);
      
    observable.subscribe({
      next: (_data) => {
        return this.router.navigate(['/module']);
      },
      complete: () => {
        setTimeout(() => this.transport.progress = false, 3000);
      }
    });
  }
  findTags() {
    this.apicall.get('/tag/list').subscribe({
      next: (result) => {
        this.tags = (result as TagModel[]);
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
