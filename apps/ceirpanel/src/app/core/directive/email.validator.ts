/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_ASYNC_VALIDATORS, Validator } from '@angular/forms';
import { Observable } from 'rxjs';
import { CustomvalidationService } from '../services/common/customvalidation.service';

@Directive({
  selector: '[ceirpanelAppValidateEmail]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => ValidateEmailDirective), multi: true }]

})
export class ValidateEmailDirective implements Validator {

  constructor(private customValidator: CustomvalidationService) { }

  validate(control: AbstractControl): Promise<unknown> | Observable<unknown> {
    return this.customValidator.userNameValidator(control);
  }
}