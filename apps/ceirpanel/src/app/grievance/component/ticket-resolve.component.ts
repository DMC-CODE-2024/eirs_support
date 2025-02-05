/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { TicketModel, TicketNoteDto } from '../../core/models/ticket.model';
import { ClrForm } from '@clr/angular';
import { NgForm } from '@angular/forms';
import { ConfigService } from 'ng-config-service';
import { AuthService } from '../../core/services/common/auth.service';

export enum ModalSize {
    small = 'sm',
    medium = 'md',
    large = 'lg',
    extraLarge = 'xl',
  }

@Component({
  selector: 'ceirpanel-ticket-resolve',
  template: `
  <clr-modal [(clrModalOpen)]="open" [clrModalStaticBackdrop]="false" [clrModalSize]="modalSize.medium" [clrModalClosable]="true"
   (clrModalAlternateClose)="open = false;confirmation.emit({open: false, resolve: 'no'})" [clrModalStaticBackdrop]="true" [clrModalPreventClose]="true">
    <h3 class="modal-title">{{ "ticket.resolved.resolveTicket" | translate }}</h3>
    <div class="modal-body m-0 p-0">
      <form clrForm clrLayout="vertical" #f="ngForm" (ngSubmit)="f.form.valid && onSubmit(f)" novalidate>
        <div class="clr-row m-0 p-0">
          <div class="clr-col-12 m-0 p-0">
            <div class="form-group">
              <label class="form-label clr-required-mark">{{ "ticket.resolved.confirmation" | translate }}</label>
              <textarea class="form-control" class="form-control form-control-sm" [(ngModel)]="notes.notes" name="notes" style="min-height: 60px !important;"
               [placeholder]="'ticket.resolved.comment' | translate" #noteObj="ngModel" [ngClass]="{ 'is-invalid': f.submitted && noteObj.errors }"
                [maxlength]="config.get('maxCommentLength') || 200" required aria-autocomplete="none"></textarea>
              <div *ngIf="f.submitted && noteObj.errors" class="invalid-feedback">
                <div *ngIf="noteObj.errors['required']">
                  {{ "ticket.resolved.required" | translate }}
                </div>
              </div> 
            </div>
          </div>
          <div class="clr-col-12 m-0 p-0 d-flex justify-content-center mt-4">
            <button type="submit" class="btn btn-primary" [ngClass]="{ 'orange-btn': !authService.isLogin() }">{{ "button.yes" | translate }}</button>
            <button type="button" class="btn btn-primary" [ngClass]="{ 'orange-btn': !authService.isLogin() }" (click)="open = false;confirmation.emit({open: false, resolve: 'no'})">{{ "button.no" | translate }}</button>
          </div>
        </div>
      </form>
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
export class TicketResolveComponent implements OnInit{
    modalSize = ModalSize;
    selectedSize!: ModalSize;
    @Input() open = false;
    @Input() ticketId!: any;
    @Output() public confirmation: EventEmitter<any> = new EventEmitter();
    ticket: TicketModel = {} as TicketModel;
    public notes: TicketNoteDto = {} as any;
    @ViewChild(ClrForm, { static: true }) public clrForm!: ClrForm;
    @ViewChild("f") public ngForm!: NgForm;

    constructor(private apicall: ApiUtilService, public config: ConfigService, public authService: AuthService){}
    
    ngOnInit(): void {
        
    }
    resolve(){
      this.confirmation.emit({open: false, notes: this.notes.notes, resolve: 'yes'});
    }
    onSubmit(userForm: NgForm) {
      if (userForm.invalid) { this.clrForm.markAsTouched(); return; }
      this.confirmation.emit({open: false, notes: this.notes.notes, resolve: 'yes'});
    }
}