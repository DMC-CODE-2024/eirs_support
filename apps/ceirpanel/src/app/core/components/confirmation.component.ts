import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum ModalSize {
  small = 'sm',
  medium = 'md',
  large = 'lg',
  extraLarge = 'xl',
}

@Component({
  selector: 'ceirpanel-ceir-confirmation',
  template: `
  <clr-modal [(clrModalOpen)]="open" [clrModalStaticBackdrop]="false">
    <h3 class="modal-title">Save and Exit</h3>
    <div class="modal-body">
        <p>Do you want to Save?</p>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-outline" (click)="open = false;confirmation.emit(false)">{{ "button.cancel"| translate }}</button>
        <button type="button" class="btn btn-primary" (click)="open = false;confirmation.emit(false)">{{ "button.save"| translate }}</button>
    </div>
</clr-modal>
  `,
  styles: [``],
})
export class ConfirmationComponent {
  modalSize = ModalSize;
  selectedSize!: ModalSize;
  @Input() open = false;
  @Output() public confirmation: EventEmitter<boolean> = new EventEmitter();
}
