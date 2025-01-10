/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ClrForm } from '@clr/angular';
import { FeatureFilterModel } from '../../core/models/feature.model';


@Component({
    selector: 'ceirpanel-feature-filter',
    template: `
 <form clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" (ngSubmit)="f.form.valid && onSubmit()">
    <div class="clr-row m-0 p-0 ">
        <div class="clr-col-2 m-0 p-0">
            <clr-date-container>
                <input type="date" autocomplete="on" clrDate name="startDate" [(ngModel)]="featureFilterModel.startDate" [placeholder]="'placeholder.startDate' | translate" class="w-95"/>
            </clr-date-container>
        </div>
        <div class="clr-col-2">
            <clr-date-container>
                <input type="date" autocomplete="off" clrDate name="endDate" [(ngModel)]="featureFilterModel.endDate" [placeholder]="'placeholder.endDate' | translate" class="w-95"/>
            </clr-date-container>
        </div>
        <div class="clr-col-2">
            <clr-input-container>
            <input clrInput type="text" id="featureName" name="featureName" [(ngModel)]="featureFilterModel.featureName" class="w-100"  
            [placeholder]="'feature.featureName.placeholder' | translate"/>
            <clr-control-error>{{ "user.name.firstName.error" | translate }}</clr-control-error>
            </clr-input-container>
        </div>
        <div class="clr-col-2 clr-col-lg-2 clr-col-xl-2 m-0 p-0">
            <div class="btn-group btn-primary">
                <button type="submit" class="btn btn-sm btn-warning mx-1" (click)="f.form.reset()">{{ "button.reset" | translate }}</button>
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
export class FeatureFilterComponent implements OnInit {
    @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
    @Input() openFilter = false;
    @Output() public featureFilter: EventEmitter<any> = new EventEmitter();
    date2!: any;
    featureFilterModel: FeatureFilterModel = {} as FeatureFilterModel;

    ngOnInit(): void {
        console.log('users: ');
    }
    onSubmit() {
        this.featureFilter.emit(this.featureFilterModel);
    }
}