/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeatureModel } from '../../core/models/feature.model';
import { AclModel } from '../../core/models/acl.model';
import { RoleModel } from '../../core/models/role.model';
import { ModuleMangeModel } from '../../core/models/module.manage.model';

export enum ModalSize {
    small = 'sm',
    medium = 'md',
    large = 'lg',
    extraLarge = 'xl',
  }

@Component({
  selector: 'ceirpanel-acl-delete',
  template: `
  <clr-modal [(clrModalOpen)]="open" [clrModalStaticBackdrop]="false" [clrModalSize]="modalSize.large" [clrModalClosable]="false">
    <h3 class="modal-title">
        <div *ngIf="status!=='21' && status !== '0'; then delete else active"></div>
        <ng-template #delete>{{ "acl.action.remove" | translate }}</ng-template>
        <ng-template #active>{{ "acl.action.active" | translate }}</ng-template>
    </h3>
    
    <div class="modal-body">
        <clr-alert [clrAlertClosable]="false" [clrAlertSizeSmall]="true" [clrAlertType]="'warning'" class="mb-2">
            <clr-alert-item class="">
                <span class="alert-text">
                    <div *ngIf="status!=='21' && status !== '0'; then tdelete else tactive"></div>
                    <ng-template #tdelete>{{ "prompt.delete" | translate }}</ng-template>
                    <ng-template #tactive>{{ "prompt.active" | translate }}</ng-template>
                </span>
            </clr-alert-item>
        </clr-alert>
        <div *ngIf="group; then singleselect else multiselect"></div>
        <ng-template #singleselect>
            <form clrStepper clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" #singleselect>
                <fieldset [disabled]="readonly" class="scheduler-border">
                    <legend class="scheduler-border">{{ "acl.pageTitle.title" | translate }}</legend>
                    <div class="clr-row m-0 p-0">
                        <div class="clr-col-4">
                            <div class="form-group">
                                <label class="clr-required-mark">{{ "role.roleName.label" | translate }}</label>
                                <input name="description" class="form-control form-control-sm" [(ngModel)]="group.role.roleName" [placeholder]="'Role Name'"/>  
                            </div>
                        </div>
                        <div class="clr-col-4">
                            <div class="form-group">
                                <label>{{ "feature.featureName.label" | translate }}</label>
                                <input type="text" name="featureName" class="form-control form-control-sm" [(ngModel)]="group.feature.featureName" [placeholder]="'feature.featureName.placeholder' | translate" required/>
                            </div>
                        </div>
                        <div class="clr-col-4">
                            <div class="form-group">
                                <label>Module Name</label>
                                <input name="description" class="form-control form-control-sm" [(ngModel)]="group.module.moduleName" [placeholder]="'Module Name'"/>  
                            </div>
                        </div>
                    </div>
                </fieldset>
                <div class="clr-row clr-justify-content-end mt-3">
                    <div class="clr-col-2">
                        <div *ngIf="status!=='21' && status !== '0'; then delete else active"></div>
                        <ng-template #delete>
                            <button type="submit" class="btn btn-primary btn-block" (click)="open = false;confirmation.emit(group)">{{ "button.delete" | translate }}</button>
                        </ng-template>
                        <ng-template #active>
                            <button type="submit" class="btn btn-primary btn-block" (click)="open = false;aconfirmation.emit(group)">{{ "button.active" | translate }}</button>
                        </ng-template>
                    </div>
                    <div class="clr-col-2">
                        <button type="button" class="btn btn-outline btn-block" (click)="open = false;">{{ "button.cancel" | translate }}</button>
                    </div>
                </div>
            </form>
        </ng-template>
        <ng-template #multiselect>
            <table class="table m-0 p-0">
                <thead>
                    <tr>
                        <th>{{ "datalist.roleName" | translate }}</th>
                        <th>{{ "datalist.featureName" | translate }}</th>
                        <th>{{ "datalist.moduleName" | translate }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let g of groups">
                        <td>{{g?.role?.roleName}}</td>   
                        <td>{{g?.feature?.featureName}}</td>
                        <td>{{g?.module?.moduleName}}</td>   
                    </tr>
                </tbody>
            </table>
            <div class="clr-row clr-justify-content-end mt-3">
                <div class="clr-col-2">
                    <button type="submit" class="btn btn-primary btn-block" (click)="open = false;confirmation.emit(groups)">{{ "button.delete" | translate }}</button>
                </div>
                <div class="clr-col-2">
                    <button type="button" class="btn btn-outline btn-block" (click)="open = false;">{{ "button.cancel" | translate }}</button>
                </div>
            </div>
        </ng-template>
    </div>
</clr-modal>
  `,
  styles: [`
    :host ::ng-deep .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 1.2rem 1rem 1rem 1rem;
    }
  `],
  providers: []
})
export class AclDeleteComponent{
    modalSize = ModalSize;
    selectedSize!: ModalSize;
    @Input() open = false;
    group: AclModel = {role: {} as RoleModel, feature: {} as FeatureModel, module: {} as ModuleMangeModel} as AclModel;
    @Input() groups: Array<any> = [];
    @Output() public confirmation: EventEmitter<AclModel | Array<AclModel>> = new EventEmitter();
    @Output() public aconfirmation: EventEmitter<AclModel | Array<AclModel>> = new EventEmitter();
    readonly = true;
    parentGroupName = 'Not Available';
    status = '4';
}