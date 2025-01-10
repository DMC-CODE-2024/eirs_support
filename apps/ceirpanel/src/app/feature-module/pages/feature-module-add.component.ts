/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm, ClrStepButton, ClrStepper } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, take } from 'rxjs';
import { PageType } from '../../core/constants/page.type';
import { FeatureModuleCreateModel } from '../../core/models/feature-module.model';
import { FeatureModel } from '../../core/models/feature.model';
import { ModuleMangeModel } from '../../core/models/module.manage.model';
import { RoleModel } from '../../core/models/role.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { FeatureModuleService } from '../service/feature.module.service';
import { FeatureModuleDto } from '../dto/feature.module.dto';

@Component({
  selector: 'ceirpanel-feature-module-add',
  template: `
   <div class="card">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-4" style="margin-top: 5px;">
          <h4 class="card-title text-capitalize">{{ "featureModule.pageTitle." + page | translate }}</h4>
        </div>
        <div class="clr-col-4 text-right" style="padding-right: 0.1rem">
          <div class="btn-group btn-primary text-right">
            <button class="btn" aria-label="Check" routerLink="/feature-module">
              <i class="bi bi-arrow-left-circle"></i> {{ "button.back" | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="card-block m-1 p-1">
    <form clrStepper clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" (ngSubmit)="f.form.valid && onSubmit(f)" autocomplete="off">
      <fieldset [disabled]="readonly" class="scheduler-border">
        <legend class="scheduler-border">Feature Module Information</legend>
        <div class="clr-row m-0 p-0">
          <div *ngIf="page === 'add'; then add else edit"></div>
          <ng-template #add>
            <div class="clr-col-6 m-0 p-0">
            <div class="form-group">
            <label class="clr-required-mark">{{ "featureModule.featureId.label" | translate }}</label>
              <select class="form-select form-control form-control-sm" name="featureId" [(ngModel)]="groupFeature.feature.id" 
                (change)="onFeatureChange($event)" pattern="^[1-9][0-9]*$"
                #featureModule="ngModel" [ngClass]="{ 'is-invalid': f.submitted && featureModule.errors }" [disabled]="page==='view' || page==='edit'">
                <option selected disabled [value]="0">{{ "featureModule.featureId.placeholder" | translate }}</option>
                <option *ngFor="let feature of features" [value]="feature.id" [disabled]="page === 'view' || page === 'edit'">{{feature?.featureName}}</option>
              </select>
              <div *ngIf="f.submitted && featureModule.errors" class="invalid-feedback">
                <div *ngIf="featureModule.errors['pattern']">{{'featureModule.featureId.error.required' | translate}}</div>
              </div>
            </div>
          </div>
          </ng-template>
          <ng-template #edit>
            <div class="clr-col-6 m-0 p-0">
            <div class="form-group">
            <label class="clr-required-mark">{{ "featureModule.featureId.label" | translate }}</label>
              <select class="form-select form-control form-control-sm" name="featureId" [(ngModel)]="groupFeature.feature.id">
                <option selected disabled [value]="0">{{ "featureModule.featureId.placeholder" | translate }}</option>
                <option *ngFor="let feature of features" [value]="feature.id" [disabled]="page === 'view' || page === 'edit'">{{feature?.featureName}}</option>
              </select>
            </div>
          </div>
          </ng-template>
        </div>
        <div class="clr-row m-0 p-0 mt-3">
          <div class="clr-col-12 m-0 p-0" style="margin-top:20px;">
            <dual-list [source]="modules" [(destination)]="confirmed" [key]="key" [display]="display" [height]="'350px'" [sort]="true"></dual-list>
          </div>
        </div>
      </fieldset>
      <div class="clr-row clr-justify-content-end mt-3">
        <div class="clr-col-2">
          <button type="submit" class="btn btn-primary btn-block">{{ "button.save" | translate }}</button>
        </div>
        <div class="clr-col-2">
          <button type="button" class="btn btn-outline btn-block" (click)="cancel=true">{{ "button.cancel" | translate }}</button>
        </div>
      </div>
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
export class FeatureModuleAddComponent implements OnInit {
  public page: string = '' as string;
  public path: string = '' as string;
  public id: number = 0 as number;
  readonly = false;
  public modules!: ModuleMangeModel[];
  selected: RoleModel [] = [];
  @ViewChild(ClrStepButton, { static: false }) submitButton!: ClrStepButton;
  @ViewChild(ClrStepper, { static: false }) clrStepper!: ClrStepper;
  templateForm: object = { parentGroup: '' } as object;
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
  groupFeature: FeatureModuleCreateModel = {feature: {id: 0}} as FeatureModuleCreateModel;
  source!: Array<any>;
  confirmed: Array<any> = [];
  key = 'id';
  display = 'moduleName';
  features: Array<FeatureModel> = [];
  public open = false;
  public cancel = false;

  constructor(
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private apicall: ApiUtilService,
    private transport: MenuTransportService,
    private router: Router,
    private featureModuleService: FeatureModuleService) { }

  ngOnInit(): void {
    this.path = this.route.snapshot.url[0].path;
    this.page = this.route.snapshot.paramMap.get('page') || '';
    this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
    if (this.page === PageType.view) { this.readonly = true; }
    this.findFeatures();
    this.findModules();
    if (this.id > 0) {
      this.featureModuleService.findByFeatureId(this.id).pipe(take(1)).subscribe((data: Array<FeatureModuleDto>) => {
        console.log('data: ', data);
        this.groupFeature = {featureId: this.id, modules: data.map(r => r.module.id), feature: {id: this.id} as FeatureModel};
        this.confirmed = data.map(r => r.module);
      });
    }
  }
  onSubmit(userForm: NgForm) {
    console.log('inside submit......');
    if (userForm.invalid) { this.clrForm.markAsTouched(); return; }
    this.save();
  }
  save() {
    console.log('inside save......');
    this.transport.progress = true;
    this.groupFeature.modules = this.confirmed.map(s => s.id);
    this.groupFeature.featureId = this.groupFeature.feature.id;
    
    const observable: Observable<unknown> = this.page == PageType.edit ?
      this.apicall.put(`/featureModule/update/${this.id}`, this.groupFeature) : this.apicall.post(`/featureModule/save`, this.groupFeature);

    observable.subscribe({
      next: (_data) => {
        console.log('role save: ', (_data as RoleModel).id);
        return this.router.navigate(['/feature-module']);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        setTimeout(() => this.transport.progress = false, 3000);
      }
    });
  }
  findFeatures() {
    this.apicall.get('/feature/list').subscribe({
      next: (result) => {
        this.features = (result as FeatureModel[]);
        console.log('features: ', this.features);
      },
      error: (e) => {
        console.log('error', e);
      },
      complete: () => {
        console.log('completed');
      }
    });
  }
  findModules() {
    this.apicall.get('/module/list').subscribe({
      next: (result) => {
        this.modules = (result as ModuleMangeModel[]);
      },
      error: (e) => {
        console.log('error', e);
      },
      complete: () => {
        console.log('error');
      }
    });
  }
  cancelOpenClose(cancel: boolean) {
    this.cancel = false;
    if(cancel == true)this.router.navigate([this.path]);
  }
  onFeatureChange($event: any) {
    this.id = $event.target.value;
    this.featureModuleService.findByFeatureId(this.id).pipe(take(1)).subscribe((data: Array<FeatureModuleDto>) => {
      this.groupFeature = {featureId: this.id, modules: data.map(r => r.module.id), feature: {id: this.id} as FeatureModel};
      this.confirmed = data.map(r => r.module);
    });
  }
}
