/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoleModel } from '../../core/models/role.model';

export enum ModalSize {
    small = 'sm',
    medium = 'md',
    large = 'lg',
    extraLarge = 'xl',
  }

@Component({
  selector: 'ceirpanel-role-delete',
  template: `
  <clr-modal [(clrModalOpen)]="open" [clrModalStaticBackdrop]="false" [clrModalSize]="modalSize.large" [clrModalClosable]="false">
    <h3 class="modal-title">
        <div *ngIf="status!=='21' && status !=='0'; then delete else active"></div>
        <ng-template #delete>{{ "role.action.remove" | translate }}</ng-template>
        <ng-template #active>{{ "role.action.active" | translate }}</ng-template>
    </h3>
    <div class="modal-body">
        <clr-alert [clrAlertClosable]="false" [clrAlertSizeSmall]="true" [clrAlertType]="'warning'" class="mb-2">
            <clr-alert-item class="">
                <span class="alert-text">
                    <div *ngIf="status!=='21'; then tdelete else tactive"></div>
                    <ng-template #tdelete>{{ "prompt.delete" | translate }}</ng-template>
                    <ng-template #tactive>{{ "prompt.active" | translate }}</ng-template>
                </span>
            </clr-alert-item>
        </clr-alert>
        <div *ngIf="role; then singleselect else multiselect"></div>
        <ng-template #singleselect>
            <form clrStepper clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" #singleselect>
                <fieldset [disabled]="readonly" class="scheduler-border">
                    <legend class="scheduler-border">{{ "role.pageTitle.title" | translate }}</legend>
                    <div class="clr-row m-0 p-0">
                    <div class="clr-col-6 m-0 p-0">
                        <div class="form-group">
                            <label class="clr-required-mark">{{ "role.roleName.label" | translate }}</label>
                            <input type="text" name="tagName" class="form-control form-control-sm" [(ngModel)]="role.roleName" [placeholder]="'role.roleName.placeholder' | translate" required/>
                        </div>
                    </div>
                    <div class="clr-col-12 m-0 p-0">
                        <div class="form-group">
                            <label class="clr-mark">{{ "role.description.label" | translate }}</label>
                            <textarea name="description" class="form-control form-control-sm" [(ngModel)]="role.description" [placeholder]="'role.description.placeholder' | translate"></textarea>  
                        </div>
                    </div>
                    </div>
                </fieldset>
                <div class="clr-row clr-justify-content-end mt-3">
                    <div class="clr-col-2">
                        <div *ngIf="status!=='21' && status!=='0'; then delete else active"></div>
                        <ng-template #delete>
                            <button type="submit" class="btn btn-primary btn-block" (click)="open = false;confirmation.emit(role)">{{ "button.delete" | translate }}</button>
                        </ng-template>
                        <ng-template #active>
                            <button type="submit" class="btn btn-primary btn-block" (click)="open = false;aconfirmation.emit(role)">{{ "button.active" | translate }}</button>
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
                        <th>{{ "datalist.description" | translate }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let tag of roles">
                        <td>{{tag?.roleName}}</td>
                        <td>{{tag?.description}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="clr-row clr-justify-content-end mt-3">
                <div class="clr-col-2">
                    <button type="submit" class="btn btn-primary btn-block" (click)="open = false;confirmation.emit(roles)">{{ "button.delete" | translate }}</button>
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
    :host ::ng-deep .modal-header, .modal-header--accessible {
    border-bottom: none;
    padding: 0 0 0.1rem 0;
    }
  `],
  providers: []
})
export class RoleDeleteComponent{
    modalSize = ModalSize;
    selectedSize!: ModalSize;
    @Input() open = false;
    role: RoleModel = {} as RoleModel;
    @Input() roles: Array<any> = [];
    @Output() public confirmation: EventEmitter<RoleModel | Array<RoleModel>> = new EventEmitter();
    @Output() public aconfirmation: EventEmitter<RoleModel | Array<RoleModel>> = new EventEmitter();
    readonly = true;
    status = '4';
}