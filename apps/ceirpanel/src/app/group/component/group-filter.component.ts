/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GroupFilterModel } from '../../core/models/group.filter.model';
import { ClrForm } from '@clr/angular';
import { NgForm } from '@angular/forms';


@Component({
    selector: 'ceirpanel-group-filter',
    template: `
 <form clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" (ngSubmit)="f.form.valid && onSubmit()">
    <div class="clr-row m-0 p-0 ">
        <div class="clr-col-2 m-0 p-0">
            <clr-date-container>
                <input type="date" autocomplete="on" clrDate name="startDate" [(ngModel)]="groupFilterModel.startDate" [placeholder]="'placeholder.startDate' | translate" class="w-95"/>
            </clr-date-container>
        </div>
        <div class="clr-col-2">
            <clr-date-container>
                <input type="date" autocomplete="off" clrDate name="endDate" [(ngModel)]="groupFilterModel.endDate" [placeholder]="'placeholder.endDate' | translate" class="w-95"/>
            </clr-date-container>
        </div>
        <div class="clr-col-2">
            <clr-input-container>
            <input clrInput type="text" id="groupName" name="groupName" [(ngModel)]="groupFilterModel.groupName" class="w-100"  
            [placeholder]="'placeholder.groupName' | translate"/>
            <clr-control-error>{{ "user.name.firstName.error" | translate }}</clr-control-error>
            </clr-input-container>
        </div>
        <div class="clr-col-2">
            <clr-input-container>
            <input clrInput type="text" id="lastName" name="parentGroupName" [(ngModel)]="groupFilterModel.parentGroupName" class="w-100"  
            [placeholder]="'placeholder.parentGroupName' | translate"/>
            <clr-control-error>{{ "user.name.firstName.error" | translate }}</clr-control-error>
            </clr-input-container>
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
export class GroupFilterComponent implements OnInit {
    @ViewChild(ClrForm, { static: true }) public clrForm!: ClrForm;
    @Input() openFilter = false;
    @Output() public userFilter: EventEmitter<any> = new EventEmitter();
    date2!: any;
    groupFilterModel: GroupFilterModel = {} as GroupFilterModel;
    @ViewChild('f') private filterForm! : NgForm;

    ngOnInit(): void {
        
    }
    onSubmit() {
        this.userFilter.emit(this.groupFilterModel);
    }
    reset(){
        this.filterForm.reset();
        this.userFilter.emit(this.groupFilterModel);
    }
}