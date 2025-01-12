/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UserFilterModel } from '../../core/models/user.filter.model';
import { ClrForm } from '@clr/angular';


@Component({
    selector: 'ceirpanel-user-filter',
    template: `
 <form clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" (ngSubmit)="f.form.valid && onSubmit()">
    <div class="clr-row m-0 p-0">
        <div class="clr-col-2 m-0 p-0">
            <clr-date-container>
                <input type="date" autocomplete="on" clrDate name="startDate" [(ngModel)]="userFilterModel.startDate" [placeholder]="'placeholder.startDate' | translate" class="w-95"/>
            </clr-date-container>
        </div>
        <div class="clr-col-2">
            <clr-date-container>
                <input type="date" autocomplete="off" clrDate name="endDate" [(ngModel)]="userFilterModel.endDate" [placeholder]="'placeholder.endDate' | translate" class="w-95"/>
            </clr-date-container>
        </div>
        <div class="clr-col-2">
            <clr-input-container>
            <input clrInput type="text" id="firstName" name="firstName" [(ngModel)]="userFilterModel.firstName" class="w-100"  
            [placeholder]="'user.name.firstName.placeholder' | translate"/>
            <clr-control-error>{{ "user.name.firstName.error" | translate }}</clr-control-error>
            </clr-input-container>
        </div>
        <div class="clr-col-2">
            <clr-input-container>
            <input clrInput type="text" id="lastName" name="lastName" [(ngModel)]="userFilterModel.lastName" class="w-100"  
            [placeholder]="'user.name.lastName.placeholder' | translate"/>
            <clr-control-error>{{ "user.name.firstName.error" | translate }}</clr-control-error>
            </clr-input-container>
        </div>
        <div class="clr-col-2">
            <clr-input-container>
            <input clrInput type="text" id="companyName" name="companyName" [(ngModel)]="userFilterModel.companyName" class="w-100" 
            [placeholder]="'user.id.organization.placeholder' | translate"/>
            <clr-control-error>{{ "user.name.firstName.error" | translate }}</clr-control-error>
            </clr-input-container>
        </div>
        <div class="clr-col-2 clr-col-lg-2 clr-col-xl-2 m-0 p-0">
            <div class="btn-group btn-primary">
                <button type="submit" class="btn btn-sm btn-warning" (click)="f.form.reset()">{{ "button.reset" | translate }}</button>
                <button type="submit" class="btn btn-sm btn-primary">{{ "button.filter" | translate }}</button>
            </div>
        </div>
    </div>
</form>
  `,
    styles: [`
    .clr-form-control {
        margin-top: 0rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
  `],
    providers: []
})
export class UserFilterComponent implements OnInit {
    @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
    @Input() openFilter = false;
    @Output() public userFilter: EventEmitter<any> = new EventEmitter();
    date2!: any;
    userFilterModel: UserFilterModel = {} as UserFilterModel;

    ngOnInit(): void {
        
    }
    onSubmit() {
        this.userFilter.emit(this.userFilterModel);
    }
}