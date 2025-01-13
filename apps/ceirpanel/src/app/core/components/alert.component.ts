import { Component } from '@angular/core';

export enum ModalSize {
  small = 'sm',
  medium = 'md',
  large = 'lg',
  extraLarge = 'xl',
}

@Component({
  selector: 'ceirpanel-ceir-alert',
  template: `
  <clr-modal [(clrModalOpen)]="open" [clrModalStaticBackdrop]="false" [clrModalClosable]="false" class="m-0 p-0">
    <h3 class="modal-title">{{ "message.alert" | translate }}</h3>
    <div class="modal-body m-0 p-0">
      <p class="m-0 p-0 lh-1" *ngFor="let m of messages">{{m}}</p>
      <div class="clr-row clr-justify-content-center">
        <div class="clr-col-12 text-end mt-2">
          <button type="button" class="btn btn-outline" (click)="open = false">Close</button>
        </div>
      </div>
    </div>
    <!--div class="modal-footer">
        <button type="button" class="btn btn-outline" (click)="open = false;confirmation.emit(true)">Yes</button>
        <button type="button" class="btn btn-primary" (click)="open = false;confirmation.emit(false)">No</button>
    </div-->
</clr-modal>
  `,
  styles: [``],
})
export class AlertComponent {
  modalSize = ModalSize;
  selectedSize!: ModalSize;
  open = false;
  messages!: Array<string>;
}
