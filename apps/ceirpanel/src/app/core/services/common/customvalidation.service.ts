/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { ApiUtilService } from './api.util.service';

@Injectable({
  providedIn: 'root',
})
export class CustomvalidationService {
  config = null;
  constructor(private apiutil: ApiUtilService) {}

  userNameValidator(
    userControl: AbstractControl
  ): Promise<unknown> | Observable<unknown> {
    return new Promise((resolve) => {
      this.apiutil.get(`/api/auth/email/${userControl.value}`).subscribe({
        next: (exist) => {
          if (exist) {
            resolve({ emailAlreadyTaken: exist });
          } else {
            resolve(null);
          }
        },
      });
    });
  }

  blankMobileValidator(
    userControl: AbstractControl
  ): Promise<unknown> | Observable<unknown> {
    return new Promise((resolve) => {
      if (_.isEmpty(userControl.value)) resolve(null);
      if (_.isEmpty(this.config)) {
        this.apiutil.get(`/config/frontend`).subscribe({
          next: (config: any) => {
            this.config = config;
            resolve(
              _.isEqual(
                this.validate(
                  String(_.get(this.config, 'mobileRegex')),
                  userControl.value
                ),
                true
              )
                ? null
                : { invalid: false }
            );
          },
        });
      } else {
        resolve(
          _.isEqual(
            this.validate(
              String(_.get(this.config, 'mobileRegex')),
              userControl.value
            ),
            true
          )
            ? null
            : { invalid: false }
        );
      }
    });
  }

  blankEmailValidator(
    userControl: AbstractControl
  ): Promise<unknown> | Observable<unknown> {
    return new Promise((resolve) => {
      if (_.isEmpty(userControl.value)) resolve(null);
      if (_.isEmpty(this.config)) {
        this.apiutil.get(`/config/frontend`).subscribe({
          next: (config: any) => {
            this.config = config;
            resolve(
              _.isEqual(
                this.validate(
                  String(_.get(this.config, 'emailRegex')),
                  userControl.value
                ),
                true
              )
                ? null
                : { invalid: false }
            );
          },
        });
      } else {
        resolve(
          _.isEqual(
            this.validate(
              String(_.get(this.config, 'emailRegex')),
              userControl.value
            ),
            true
          )
            ? null
            : { invalid: false }
        );
      }
    });
  }
  private validate(regex: string, value: string) {
    const regexp = new RegExp(regex);
    return regexp.test(value);
  }

  imeiValidator(
    userControl: AbstractControl
  ): Promise<unknown> | Observable<unknown> {
    return new Promise((resolve) => {
      if (userControl.value.length < 15) {
        resolve({ imeiNotExist: true });
      } else {
        this.apiutil
          .post(`/device/checkDevice`, {
            imei: userControl.value,
            channel: 'web',
            language: 'us',
            medium: 'web',
            msisdn: '',
            operator: 'eirs',
          })
          .subscribe({
            next: (exist) => {
              if (exist) {
                resolve(null);
              } else {
                resolve({ imeiNotExist: true });
              }
            },
          });
      }
    });
  }

  ticketIdValidator(
    userControl: AbstractControl
  ): Promise<unknown> | Observable<unknown> {
    return new Promise((resolve) => {
      this.apiutil.get(`/ticket/${userControl.value}`).subscribe({
        next: (exist) => {
          if (_.isEqual(_.get(exist, 'message'), 'notValidTicketId')) {
            resolve({ ticketIdNotExist: true });
          } else {
            resolve(null);
          }
        },
      });
    });
  }

  MatchPassword(password: string, confirmPassword: string): ValidationErrors {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl?.errors['passwordMismatch']
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
      return null;
    };
  }
}
