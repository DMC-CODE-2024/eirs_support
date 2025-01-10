/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm, ClrStepButton, ClrStepper } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs';
import { PageType } from '../../core/constants/page.type';
import { FeatureModel } from '../../core/models/feature.model';
import { LinkModel } from '../../core/models/link.model';
import { ModuleMangeModel } from '../../core/models/module.manage.model';
import { TagModel } from '../../core/models/tag.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { UploadService } from '../../core/services/common/upload.service';
import * as _ from 'lodash'; 
import { FeatureService } from '../service/feature.service';

@Component({
  selector: 'ceirpanel-feature-add',
  template: `
   <div class="card">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-4" style="margin-top: 5px;">
          <h4 class="card-title text-capitalize">{{ "feature.pageTitle." + page | translate }}</h4>
        </div>
        <div class="clr-col-4 text-right" style="padding-right: 0.1rem">
          <div class="btn-group btn-primary text-right">
            <button class="btn" aria-label="Check" routerLink="/feature">
              <i class="bi bi-arrow-left-circle"></i> {{ "button.back" | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="card-block m-1 p-1">
    <form clrStepper clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" (ngSubmit)="f.form.valid && onSubmit(f)" autocomplete="off">
      <fieldset [disabled]="readonly" class="scheduler-border">
        <legend class="scheduler-border">{{ "feature.pageTitle.title" | translate }}</legend>
        <div class="clr-row m-0 p-0">
          <div class="clr-col-6">
            <div class="form-group">
              <label class="clr-required-mark">{{ "feature.featureName.label" | translate }}</label>
              <input type="text" name="featureName" class="form-control form-control-sm" id="featureName" [(ngModel)]="feature.featureName" required
                [placeholder]="'feature.featureName.placeholder' | translate" #featureName="ngModel" [ngClass]="{ 'is-invalid': f.submitted && featureName.errors }">
              <div *ngIf="f.submitted && featureName.errors" class="invalid-feedback">
                <div *ngIf="featureName.errors['required']">{{'feature.featureName.error.required' | translate}}</div>
              </div>
            </div>
          </div>
          <div class="clr-col-6">
            <div class="form-group">
              <label class="clr-required-mark">{{ "feature.category.label" | translate }}</label>
              <select class="form-select form-control form-control-sm" name="category" [(ngModel)]="feature.category"
               #category="ngModel" [ngClass]="{ 'is-invalid': f.submitted && category.errors }" required>
                <option selected disabled [value]="''">{{ "feature.category.placeholder" | translate }}</option>
                <option *ngFor="let category of categories" [value]="category">{{category}}</option>
              </select>
              <div *ngIf="f.submitted && category.errors" class="invalid-feedback">
                <div *ngIf="category.errors['required']">{{'feature.category.error.required' | translate}}</div>
              </div>
            </div>
          </div>
          <div class="clr-col-12 mt-3">
            <div class="form-group">
              <label for="description" class="form-label fw-semibold">{{'feature.description.label' | translate}}</label>
              <textarea class="form-control" name="description" class="form-control form-control-sm" id="description" [(ngModel)]="feature.description"
                [placeholder]="'feature.description.placeholder' | translate"></textarea>
            </div>
          </div>
          <div class="clr-col-6 mt-3">
            <div class="form-group">
              <label class="clr-required-mark">{{ "feature.linkController.label" | translate }}</label>
              <select class="form-select form-control form-control-sm" name="link" [(ngModel)]="feature.link" required
               #link="ngModel" [ngClass]="{ 'is-invalid': f.submitted && link.errors }">
                <option selected disabled [value]="''">{{ "feature.linkController.placeholder" | translate }}</option>
                <option *ngFor="let link of links" [value]="link.linkName">{{link.linkName}}</option>
              </select>
              <div *ngIf="f.submitted && link.errors" class="invalid-feedback">
                <div *ngIf="link.errors['required']">{{'feature.linkController.error.required' | translate}}</div>
              </div>
            </div>
          </div>
          <div class="clr-col-6" style="margin-top:48px;">
            <div class="clr-row clr-justify-content-start m-0 p-0">
              <div class="clr-col-6 m-0 p-0">
                <input type="file" accept="image/jpeg,image/png,image/svg+xml" #file style="display: none;" (change)="onFileSelect($event)">
                <button type="button" class="btn btn-primary-outline btn-block mt-1" (click)="file.click()">
                  <cds-icon shape="plus"></cds-icon>{{ "feature.logo.label" | translate }}
                </button>
              </div>
              <div class="clr-col-4 text-left mt-1" *ngIf="imageObject && imageObject.length > 0">
                <ng-image-slider
                [images]="imageObject"
                [autoSlide]="{interval: 2, stopOnHover: false}"
                [imageSize]="{width: 40, height: 36, space: 1}"
                [manageImageRatio]="false"
                [videoAutoPlay]="true"
                [showVideoControls]="true"
                [paginationShow]="false">
                </ng-image-slider>
              </div>
            </div>
          </div>
          <div class="clr-col-6 mt-3">
            <div class="form-group">
              <clr-checkbox-wrapper>
                <label>{{ "feature.multiLangSupport.label" | translate }}</label>
                <input type="checkbox" clrCheckbox [(ngModel)]="feature.multiLangSupport" name="multiLangSupport" />
              </clr-checkbox-wrapper>
            </div>
          </div>
          <!--div class="clr-col-6 mt-3">
            <div class="form-group">
            <label class="clr-required-mark">{{ "feature.defaultModule.label" | translate }}</label>
              <select class="form-select form-control form-control-sm" name="defaultModule" [(ngModel)]="feature.defaultModule.id"
               #defaultModule="ngModel" [ngClass]="{ 'is-invalid': f.submitted && defaultModule.errors }"
               pattern="^[1-9][0-9]*$">
                <option selected disabled [value]="'0'">{{ "feature.defaultModule.placeholder" | translate }}</option>
                <option *ngFor="let module of modules" [value]="module.id">{{module.moduleName}}</option>
              </select>
              <div *ngIf="f.submitted && defaultModule.errors" class="invalid-feedback">
                <div *ngIf="defaultModule.errors['pattern']">{{'feature.defaultModule.error.required' | translate}}</div>
              </div>
            </div>
          </div-->
          <!--div class="clr-col-6 mt-3">
            <div class="form-group">
              <label class="clr-required-mark">{{ "feature.tagName.label" | translate }}</label>
              <select class="form-select form-control form-control-sm" name="module" [(ngModel)]="feature.moduleTag.id"
               #moduleTag="ngModel" [ngClass]="{ 'is-invalid': f.submitted && moduleTag.errors }" pattern="^[1-9][0-9]*$">
                <option selected disabled [value]="'0'">{{ "feature.tagName.placeholder" | translate }}</option>
                <option *ngFor="let tag of tags" [value]="tag.id">{{tag.moduleTagName}}</option>
              </select>
              <div *ngIf="f.submitted && moduleTag.errors" class="invalid-feedback">
                <div *ngIf="moduleTag.errors['pattern']">{{'feature.tagName.error.required' | translate}}</div>
              </div>
            </div>
          </div-->
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
export class FeatureAddComponent implements OnInit {
  public page: string = '' as string;
  public path: string = '' as string;
  public id: number = 0 as number;
  readonly = false;
  @ViewChild(ClrStepButton, { static: false }) submitButton!: ClrStepButton;
  @ViewChild(ClrStepper, { static: false }) clrStepper!: ClrStepper;
  templateForm: object = { parentGroup: '' } as object;
  categories = [];
  feature: FeatureModel = {category:'',link: '',multiLangSupport: true, defaultModule: {id: 0},moduleTag:{id:0}} as FeatureModel;
  public modules: ModuleMangeModel[] = [];
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
  public open = false;
  public cancel = false;
  public delete = false;
  tags: Array<TagModel> = [];
  links: Array<LinkModel> = [];
  uploader!: FileUploader;
  hasBaseDropZoneOver!: boolean;
  hasAnotherDropZoneOver!: boolean;
  response: string = '' as string;
  localImageUrl: any;
  imageObject: Array<any> = [] as Array<any>;
  file!: File;
  private uri!: string;

  constructor(
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private apicall: ApiUtilService,
    private transport: MenuTransportService,
    private router: Router,
    private uploadService: UploadService,
    public sanitizer: DomSanitizer,
    private featureService: FeatureService) {
  }
  onFileSelect(event: any) {
    this.file = event.target.files[0];
    this.localImageUrl = (window.URL) ? window.URL.createObjectURL(this.file) : (window as any).webkitURL.createObjectURL(this.file);
    this.imageObject = [];
    this.imageObject.push({ image: this.localImageUrl, thumbImage: this.localImageUrl });
  }
  ngOnInit(): void {
    this.path = this.route.snapshot.url[0].path;
    this.page = this.route.snapshot.paramMap.get('page') || '';
    this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
    if (this.page === PageType.view) {
      this.readonly = true;
    }
    this.getModules();
    this.getCategories();
    this.findTags();
    this.findLinks();
    if (this.id > 0) {
      this.apicall.get(`/feature/${this.id}`).subscribe({
        next: (data) => {
          this.feature = data as FeatureModel;
          if(this.feature.logo ){
            this.imageObject.push({ image: this.uploadService.resource(this.feature.logo), thumbImage: this.uploadService.resource(this.feature.logo) });
          }
          this.feature.link = _.get(_.find(this.links,{url: this.feature.link}),'linkName',this.feature.link);
          this.feature.logo = _.get(_.find(this.links,{icon: this.feature.link}),'icon',"");
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
    if (this.feature.moduleTag) this.feature.moduleTagId = this.feature.moduleTag.id;
    const formData: FormData = new FormData();
    if(this.file)formData.append('file', this.file);
    this.putData(formData, this.feature);
    const observable: Observable<unknown> = this.page == PageType.edit ?
      this.apicall.putMultipart(`/feature/update/${this.id}`, formData) : this.apicall.postMultipart(`/feature/save`, formData);

    observable.subscribe({
      next: (_data) => {
        console.log('role save: ', (_data as FeatureModel).id);
        return this.router.navigate(['/feature']);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        setTimeout(() => this.transport.progress = false, 3000);
      }
    });
  }
  putData(formData: FormData, feature: FeatureModel) {
    const filters: any[] = [];
    Object.keys(feature).forEach((key) => {
      filters.push({ property: key, value: feature[key] });
      formData.append(key, feature[key]);
    });
  }

  getCategories() {
    this.apicall.get('/category/list').subscribe({
      next: (result) => {
        this.categories = (result as []);
      },
      error: (e) => {
        console.log('error', e);
      },
      complete: () => {
        console.log('error');
      }
    });
  }
  getModules() {
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
    if (cancel == true) this.router.navigate([this.path]);
  }
  findTags() {
    this.apicall.get('/tag/list').subscribe({ next: (result) => this.tags = (result as TagModel[]) });
  }
  findLinks() {
    this.apicall.get('/link/list').subscribe({ next: (result) => this.links = (result as LinkModel[]) });
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
}
