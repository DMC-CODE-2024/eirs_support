/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { AlertComponent } from '../../core/components/alert.component';
import * as _ from 'lodash';

@Component({
  selector: 'ceirpanel-tag-add',
  template: `
   <div class="card" style="min-height: 85vh;">
    <div class="card-header">
      <div class="clr-row clr-justify-content-between">
        <div class="clr-col-4" style="margin-top: 5px;">
          <h4 class="card-title text-capitalize">{{ "tag.pageTitle." + page | translate }}</h4>
        </div>
        <div class="clr-col-4 text-right" style="padding-right: 0.1rem">
          <div class="btn-group btn-primary text-right">
            <button class="btn" aria-label="Check" routerLink="/tag">
              <i class="bi bi-arrow-left-circle"></i> {{ "button.back" | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="card-block m-1 p-1">
    <form clrStepper clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" (ngSubmit)="f.form.valid && onSubmit(f)">
      <clr-alert *ngIf="error" [clrAlertType]="error.type" [clrAlertAppLevel]="true">
        <clr-alert-item>
          <span class="alert-text text-white">{{ "message." + error.message | translate }}</span>
        </clr-alert-item>
      </clr-alert>
      <fieldset [disabled]="readonly" class="scheduler-border">
        <legend class="scheduler-border">{{ "tag.pageTitle.title" | translate }}</legend>
        <div class="clr-row m-0 p-0">
          <div class="clr-col-6">
            <div class="form-group">
              <label class="clr-required-mark">{{ "tag.moduleTagName.label" | translate }}</label>
              <input type="text" name="moduleTagName" class="form-control form-control-sm" id="moduleTagName" [(ngModel)]="tag.moduleTagName" required
                [placeholder]="'tag.moduleTagName.placeholder' | translate" #moduleTagName="ngModel" [ngClass]="{ 'is-invalid': f.submitted && moduleTagName.errors }">
              <div *ngIf="f.submitted && moduleTagName.errors" class="invalid-feedback">
                <div *ngIf="moduleTagName.errors['required']">Module tag name required</div>
              </div>
            </div>
          </div>
          <div class="clr-col-12 mt-3">
            <div class="form-group">
              <label class="clr--mark">{{ "tag.description.label" | translate }}</label>
              <textarea class="form-control" name="description" class="form-control form-control-sm" id="description" [(ngModel)]="tag.description"
                [placeholder]="'tag.description.placeholder' | translate"></textarea>
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
   <ceirpanel-ceir-alert></ceirpanel-ceir-alert>
  `,
  styles: [`
  :host ::ng-deep .clr-combobox-wrapper {
    min-width: 95% !important;
  }
  `],
})
export class TagAddComponent implements OnInit {
  public page: string = '' as string;
  public path: string = '' as string;
  public id: number = 0 as number;
  readonly = false;
  @ViewChild(ClrStepButton, { static: false }) submitButton!: ClrStepButton;
  @ViewChild(ClrStepper, { static: false }) clrStepper!: ClrStepper;
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
  templateForm: object = { parentGroup: '' } as object;
  tag: TagModel = {} as TagModel;
  public open = false;
  public cancel = false;
  error!:any;
  @ViewChild(AlertComponent, { static: true }) private alert!: AlertComponent;
  
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
    if (this.id > 0) {
      this.apicall.get(`/tag/${this.id}`).subscribe({
        next: (data) => {
          this.tag = data as TagModel;
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
    
    const observable: Observable<unknown> = this.page == PageType.edit ? 
      this.apicall.put(`/tag/update/${this.id}`, this.tag) : this.apicall.post(`/tag/save`, this.tag);
      
    observable.subscribe({
      next: (_data) => {
        if (_.isEqual(_.get(_data, 'status'), 'failed')) {
          this.error = {type: 'danger', message: _.get(_data,'message')};
          setTimeout(() => this.error = null, 10000);
        } else {
          this.router.navigate(['/tag']);
        }
      },
      complete: () => {
        setTimeout(() => this.transport.progress = false, 3000);
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
