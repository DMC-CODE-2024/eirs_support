/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeatureModuleDto } from '../dto/feature.module.dto';

export enum ModalSize {
    small = 'sm',
    medium = 'md',
    large = 'lg',
    extraLarge = 'xl',
  }

@Component({
  selector: 'ceirpanel-feature-module-delete',
  template: `
  <clr-modal [(clrModalOpen)]="open" [clrModalStaticBackdrop]="false" [clrModalSize]="modalSize.large" [clrModalClosable]="false">
    <h3 class="modal-title">
        <div *ngIf="status!=='21' && status !== '0'; then delete else active"></div>
        <ng-template #delete>{{ "featureModule.action.remove" | translate }}</ng-template>
        <ng-template #active>{{ "featureModule.action.active" | translate }}</ng-template>
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
        <div *ngIf="userGroup; then singleselect else multiselect"></div>
        <ng-template #singleselect>
            <form clrStepper clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" #singleselect>
                <fieldset [disabled]="readonly" class="scheduler-border">
                    <legend class="scheduler-border">{{ "featureModule.pageTitle.title" | translate }}</legend>
                    <div class="clr-row m-0 p-0">
                    <div class="clr-col-6 m-0 p-0">
                        <div class="form-group">
                            <label>{{ "placeholder.featureName" | translate }}</label>
                            <input type="text" name="featureName" class="form-control form-control-sm" [(ngModel)]="userGroup.feature.featureName" required/>
                        </div>
                    </div>
                    <div class="clr-col-6">
                        <div class="form-group">
                            <label class="clr-required-mark">{{ "placeholder.moduleName" | translate }}</label>
                            <input type="text" name="moduleName" class="form-control form-control-sm" [(ngModel)]="userGroup.module.moduleName" required/>
                    </div>
                    </div>
                    </div>
                </fieldset>
                <div class="clr-row clr-justify-content-end mt-3">
                    <div class="clr-col-2">
                        <div *ngIf="status!=='21' && status !== '0'; then delete else active"></div>
                        <ng-template #delete>
                            <button type="submit" class="btn btn-primary btn-block" (click)="open = false;confirmation.emit(userGroup)">{{ "button.delete" | translate }}</button>
                        </ng-template>
                        <ng-template #active>
                            <button type="submit" class="btn btn-primary btn-block" (click)="open = false;aconfirmation.emit(userGroup)">{{ "button.active" | translate }}</button>
                        </ng-template>
                    </div>
                    <div class="clr-col-2">
                        <button type="button" class="btn btn-outline btn-block" (click)="open = false">{{ "button.cancel" | translate }}</button>
                    </div>
                </div>
            </form>
        </ng-template>
        <ng-template #multiselect>
            <table class="table m-0 p-0">
                <thead>
                    <tr>
                        <th>{{ "datalist.featureName" | translate }}</th>
                        <th>{{ "datalist.moduleName" | translate }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let g of userGroups">
                        <td>{{g?.feature?.featureName}}</td>
                        <td>{{g?.module?.moduleName}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="clr-row clr-justify-content-end mt-3">
                <div class="clr-col-2">
                    <button type="submit" class="btn btn-primary btn-block" (click)="open = false;confirmation.emit(userGroups)">{{ "button.delete" | translate }}</button>
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
export class FeatureModuleDeleteComponent{
    modalSize = ModalSize;
    selectedSize!: ModalSize;
    @Input() open = false;
    userGroup!: FeatureModuleDto;
    userGroups: Array<any> = [];
    @Output() public confirmation: EventEmitter<FeatureModuleDto | Array<FeatureModuleDto>> = new EventEmitter();
    @Output() public aconfirmation: EventEmitter<FeatureModuleDto | Array<FeatureModuleDto>> = new EventEmitter();
    readonly = true;
    parentGroupName = 'Not Available';
    status = '4';
}