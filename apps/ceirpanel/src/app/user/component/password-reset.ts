/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserModel } from '../../core/models/user.model';

export enum ModalSize {
    small = 'sm',
    medium = 'md',
    large = 'lg',
    extraLarge = 'xl',
  }

@Component({
  selector: 'ceirpanel-password-reset',
  template: `
  <clr-modal [(clrModalOpen)]="open" [clrModalStaticBackdrop]="false" [clrModalSize]="modalSize.large" [clrModalClosable]="false">
    <h3 class="modal-title">
        Reset Password
    </h3>
    <div class="modal-body">
        <clr-alert [clrAlertClosable]="false" [clrAlertSizeSmall]="true" [clrAlertType]="'warning'" class="mb-2">
            <clr-alert-item class="">
                <span class="alert-text">
                    Are you sure you want to reset the password for these users?
                </span>
            </clr-alert-item>
        </clr-alert>
        <div *ngIf="userGroup; then singleselect else multiselect"></div>
        <ng-template #singleselect>
            <form clrStepper clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" #singleselect>
                <fieldset [disabled]="true" class="scheduler-border">
                    <legend class="scheduler-border">User Information</legend>
                    <div class="clr-row m-0 p-0">
                        <div class="clr-col-4">
                            <div class="form-group">
                                <label>{{ "placeholder.firstName" | translate }}</label>
                                <input type="text" name="firstName" class="form-control form-control-sm" [(ngModel)]="userGroup.profile.firstName" required/>
                            </div>
                        </div>
                        <div class="clr-col-4">
                            <div class="form-group">
                                <label class="clr-required-mark">{{ "placeholder.lastName" | translate }}</label>
                                <input type="text" name="lastName" class="form-control form-control-sm" [(ngModel)]="userGroup.profile.lastName" required/>
                            </div>
                        </div>
                        <div class="clr-col-4">
                            <div class="form-group">
                                <label class="clr-required-mark">{{ "placeholder.userName" | translate }}</label>
                                <input type="text" name="userName" class="form-control form-control-sm" [(ngModel)]="userGroup.userName" required/>
                            </div>
                        </div>
                    </div>
                </fieldset>
                <div class="clr-row clr-justify-content-end mt-3">
                    <div class="clr-col-2">
                        <button type="submit" class="btn btn-primary btn-block" (click)="open = false;confirmation.emit(userGroup)">{{ "button.reset" | translate }}</button>
                    </div>
                    <div class="clr-col-2">
                        <button type="button" class="btn btn-outline btn-block" (click)="open = false">{{ "button.cancel" | translate }}</button>
                    </div>
                </div>
            </form>
        </ng-template>
        <ng-template #multiselect>
            <table class="table table-compact m-0 p-0 mt-1">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>User Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let user of users">
                        <td>{{user?.profile?.firstName}}</td>
                        <td>{{user?.profile?.lastName}}</td>
                        <td>{{user?.userName}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="clr-row clr-justify-content-end mt-3">
                <div class="clr-col-2">
                    <button type="submit" class="btn btn-primary btn-block" (click)="open = false;confirmation.emit(users)">{{ "button.reset" | translate }}</button>
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
export class PasswordResetComponent{
    modalSize = ModalSize;
    selectedSize!: ModalSize;
    @Input() open = false;
    users: Array<any> = [];
    userGroup!: UserModel;
    @Output() public confirmation: EventEmitter<UserModel| Array<UserModel>> = new EventEmitter();
    @Output() public aconfirmation: EventEmitter<UserModel| Array<UserModel>> = new EventEmitter();
    status = '4';
}