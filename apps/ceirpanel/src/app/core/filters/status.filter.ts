/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter } from '@angular/core';
import { ClrDatagridFilterInterface } from '@clr/angular';
import { CeirCommonModule } from '../../ceir-common/ceir-common.module';
import { Device } from '../models/device.model';

@Component({
    moduleId: 'ceirpanel-status-filter',
    selector: 'ceirpanel-status-filter',
    standalone: true,
    template: `
    <clr-radio-container clrInline>
        <clr-radio-wrapper>
            <input type="radio" clrRadio value="New" name="options" (click)="toggleColor('New')"/>
            <label>New</label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
            <input type="radio" clrRadio value="Deleted" name="options" (click)="toggleColor('Deleted')"/>
            <label>Deleted</label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
            <input type="radio" clrRadio value="Updated" name="options" (click)="toggleColor('Updated')"/>
            <label>Updated</label>
        </clr-radio-wrapper>
    </clr-radio-container>
    `,
    imports: [CeirCommonModule]
})
export class StatusFilterComponent implements ClrDatagridFilterInterface<Device> {
   
    selectedColors: { [color: string]: boolean } = {};
    nbColors = 0;

    changes: any = new EventEmitter<any>(false);
    selectedState = '';

    toggleColor(state: string) {
        this.selectedState = state;
        this.changes.emit(true);
    }

    accepts(user: Device) {
        return '' + user.stateInterp === this.selectedState;
    }

    isActive(): boolean {
        return this.selectedState.length > 0;
    }
}