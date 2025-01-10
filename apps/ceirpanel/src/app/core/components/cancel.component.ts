import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum ModalSize {
  small = 'sm',
  medium = 'md',
  large = 'lg',
  extraLarge = 'xl',
}

@Component({
  selector: 'ceirpanel-ceir-cancel',
  template: `
  <clr-modal [(clrModalOpen)]="open" [clrModalStaticBackdrop]="false" [clrModalClosable]="false" class="m-0 p-0">
    <h3 class="modal-title">{{ "button.cancel"| translate }}</h3>
    <div class="modal-body m-0 p-0">
      <span class="">{{ "message.confirmation"| translate }}</span>
      <div class="clr-row clr-justify-content-center">
        <div class="clr-col-12 text-center mt-2">
        <button type="button" class="btn btn-outline" (click)="open = false;confirmation.emit(true)">{{ "button.yes"| translate }}</button>
        <button type="button" class="btn btn-primary" (click)="open = false;confirmation.emit(false)">{{ "button.no"| translate }}</button>  
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
export class CancelComponent {
  modalSize = ModalSize;
  selectedSize!: ModalSize;
  @Input() open = false;
  @Output() public confirmation: EventEmitter<boolean> = new EventEmitter();
}
