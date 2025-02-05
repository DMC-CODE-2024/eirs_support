/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TicketFeedbackDto, TicketModel } from '../../core/models/ticket.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { ConfigService } from 'ng-config-service';
import { NgForm } from '@angular/forms';
import { ClrForm } from '@clr/angular';
import { AuthService } from '../../core/services/common/auth.service';

export enum ModalSize {
    small = 'sm',
    medium = 'md',
    large = 'lg',
    extraLarge = 'xl',
  }

@Component({
  selector: 'ceirpanel-ticket-feedback',
  template: `
  <clr-modal [(clrModalOpen)]="open" [clrModalStaticBackdrop]="false" [clrModalSize]="modalSize.medium" [clrModalClosable]="true"
   (clrModalAlternateClose)="open = false;confirmation.emit({open: false, resolve: 'no'})" [clrModalStaticBackdrop]="true" [clrModalPreventClose]="true">
    <h3 class="modal-title">{{ "ticket.feedback.label" | translate }}</h3>
    <div class="modal-body m-0 p-0">
      <form clrForm clrLayout="vertical" #f="ngForm" (ngSubmit)="f.form.valid && onSubmit(f)" novalidate>
        <div class="clr-row m-0 p-0">
          <div class="clr-col-12 m-0 p-0">
            <label class="form-label clr-required-mark">{{ "ticket.feedback.rate" | translate }}</label>
            <ngx-stars [readonly]="false" [size]="2"  [color]="'#A36500'" [initialStars]="rate.ratings" [maxStars]="5" (ratingOutput)="onRatingSet($event)"></ngx-stars>
          </div>
          <div class="clr-col-12 m-0 p-0">
            <div class="form-group">
                <label class="form-label clr-required-mark">{{ "ticket.feedback.write" | translate }}</label>
                <textarea [(ngModel)]="rate.feedback" name="feedback" class="form-control"
                 [placeholder]="'ticket.feedback.placeholder' | translate" #noteObj="ngModel" [ngClass]="{ 'is-invalid': f.submitted && noteObj.errors }"
                  aria-autocomplete="none" autocomplete="off" [maxlength]="config.get('maxCommentLength') || 200" required></textarea>
                 <div *ngIf="f.submitted && noteObj.errors" class="invalid-feedback">
                  <div *ngIf="noteObj.errors['required']">{{ "ticket.feedback.required" | translate }}</div>
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
export class TicketFeedbackComponent implements OnInit{
    modalSize = ModalSize;
    selectedSize!: ModalSize;
    @Input() open = false;
    @Input() ticketId!: any;
    @Output() public confirmation: EventEmitter<any> = new EventEmitter();
    ticket: TicketModel = {} as TicketModel;
    @ViewChild(ClrForm, { static: true }) public clrForm!: ClrForm;
    public rate: TicketFeedbackDto = {ratings: 0} as any;

    constructor(private apicall: ApiUtilService, public config: ConfigService, public authService: AuthService){}
    
    ngOnInit(): void {
        
    }
    resolve(){
      this.confirmation.emit({open: false, ratings: this.rate.ratings, resolve: 'yes', feedback: this.rate.feedback});
    }
    onRatingSet(rating: number): void {
      this.rate.ratings = rating;
    }
    onSubmit(userForm: NgForm) {
      if (userForm.invalid) { this.clrForm.markAsTouched(); return; }
      this.confirmation.emit({open: false, ratings: this.rate.ratings, resolve: 'yes', feedback: this.rate.feedback});
    }
}