/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GroupModel } from '../../core/models/group.model';

export enum ModalSize {
    small = 'sm',
    medium = 'md',
    large = 'lg',
    extraLarge = 'xl',
  }

@Component({
  selector: 'ceirpanel-group-delete',
  template: `
  <clr-modal [(clrModalOpen)]="open" [clrModalStaticBackdrop]="false" [clrModalSize]="modalSize.large" [clrModalClosable]="false">
    <h3 class="modal-title">Delete Group</h3>
    <div class="modal-body">
        <div *ngIf="group; then singleselect else multiselect"></div>
        <ng-template #singleselect>
            <form clrStepper clrForm clrLayout="vertical" class="m-0 p-0" #f="ngForm" #singleselect>
                <fieldset [disabled]="readonly" class="scheduler-border">
                    <legend class="scheduler-border">Group Information</legend>
                    <div class="clr-row m-0 p-0">
                    <div class="clr-col-6 m-0 p-0">
                        <clr-input-container>
                            <label>{{ "group.parentGroup.label" | translate }}</label>
                            <input *ngIf="group.parent" clrInput type="text" class="w-100" name="parentGroupName" [(ngModel)]="group.parent.groupName" [placeholder]="'group.parentGroup.placeholder' | translate"/>
                            <input *ngIf="!group.parent" clrInput type="text" class="w-100" name="parentGroupName" [(ngModel)]="parentGroupName" [placeholder]="'group.parentGroup.placeholder' | translate"/>
                        </clr-input-container>
                    </div>
                    <div class="clr-col-6">
                        <clr-input-container>
                            <label class="clr-required-mark">{{ "group.groupName.label" | translate }}</label>
                            <input clrInput type="text" name="groupName" class="w-100" [(ngModel)]="group.groupName" [placeholder]="'group.groupName.placeholder' | translate" required/>
                        </clr-input-container>
                    </div>
                    <div class="clr-col-12 m-0 p-0">
                        <clr-textarea-container>
                            <label class="clr-mark">{{ "group.description.label" | translate }}</label>
                            <textarea clrTextarea name="description" class="w-100" [(ngModel)]="group.description" [placeholder]="'group.description.placeholder' | translate"></textarea>  
                        </clr-textarea-container>
                    </div>
                    </div>
                </fieldset>
                <div class="clr-row clr-justify-content-end mt-3">
                    <div class="clr-col-2">
                        <button type="submit" class="btn btn-primary btn-block" (click)="open = false;confirmation.emit(true)">{{ "button.delete" | translate }}</button>
                    </div>
                    <div class="clr-col-2">
                        <button type="button" class="btn btn-outline btn-block" (click)="open = false;confirmation.emit(false)">{{ "button.cancel" | translate }}</button>
                    </div>
                </div>
            </form>
        </ng-template>
        <ng-template #multiselect>
            <table class="table m-0 p-0">
                <thead>
                    <tr>
                        <th>Parent Group Name</th>
                        <th>Parent Group Name</th>
                        <th>Parent Group Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let g of groups">
                        <td>
                            <span *ngIf="g.parent; else parent">{{g?.parent?.groupName}}</span>
                            <ng-template #parent>
                                <span class="text-danger">Not Available</span>
                            </ng-template>
                        </td>
                        <td>{{g?.groupName}}</td>
                        <td>{{g?.description}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="clr-row clr-justify-content-end mt-3">
                <div class="clr-col-2">
                    <button type="submit" class="btn btn-primary btn-block" (click)="open = false;confirmation.emit(true)">{{ "button.delete" | translate }}</button>
                </div>
                <div class="clr-col-2">
                    <button type="button" class="btn btn-outline btn-block" (click)="open = false;confirmation.emit(false)">{{ "button.cancel" | translate }}</button>
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
export class GroupDeleteComponent implements OnInit{
    modalSize = ModalSize;
    selectedSize!: ModalSize;
    @Input() open = false;
    group: GroupModel = {} as GroupModel;
    @Input() groups: Array<any> = [];
    @Output() public confirmation: EventEmitter<boolean> = new EventEmitter();
    readonly = true;
    parentGroupName = 'Not Available';
    ngOnInit(): void {
        this.group = this.groups.length == 1 ? this.groups[0]: null;
    }
}