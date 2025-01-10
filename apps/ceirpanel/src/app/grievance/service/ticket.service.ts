/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TicketModel } from '../../core/models/ticket.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { AuthService } from '../../core/services/common/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(
    private apicall: ApiUtilService,
    private transport: MenuTransportService,
    private router: Router,
    private auth: AuthService
  ) {}

  public putData(formData: FormData, ticket: TicketModel) {
    Object.keys(ticket).forEach((key) => {
      formData.append(key, (ticket as never)[key]);
    });
  }
  
  public notes(formData: FormData) {
    this.transport.progress = true;
    this.apicall.post(`/ticket/save/note`, formData).subscribe({
      next: (_data) => {
        console.log(_data);
        this.transport.alert = {
          message: 'registerTicketSuccess',
          type: 'info',
        } as unknown;
      },
      complete: () => {
        setTimeout(() => (this.transport.progress = false), 3000);
      },
    });
  }
  public create(formData: FormData, page: string, lang: string | 'us', header: string | 'yes') {
    this.transport.progress = true;
    this.apicall.post(`/ticket/save`, formData).subscribe({
      next: (_data) => {
        if (_.isEqual(_.get(_data, 'message'), 'registerTicketFailed')) {
          this.transport.alert = {
            message: 'registerTicketFailed',
            type: 'info',
          } as unknown;
        } else {
          this.transport.alert = {
            message: 'registerTicketSuccess',
            type: 'info',
          } as unknown;
          if(this.auth.isLogin()) {
            if(_.isEqual(page, 'ticket')) {
              this.router.navigate(['/ticket/register-ticket-success',(_data as any).ticketId],{queryParams:{lang,header}});
            } else {
              this.router.navigate(['/register-ticket/register-ticket-success',(_data as any).ticketId,],{queryParams:{lang,header}});
            }
          } else {
            this.router.navigate(['/ticket/register-ticket-success',(_data as any).ticketId,],{queryParams:{lang,header}});
          }
        }
      },
      complete: () => {
        setTimeout(() => (this.transport.progress = false), 3000);
      },
    });
  }
  public update(formData: FormData) {
    this.transport.progress = true;
    this.apicall.put(`/ticket/save`, formData).subscribe({
      next: () => {
        this.transport.alert = {
          message: 'registerTicketSuccess',
          type: 'info',
        } as unknown;
        return this.router.navigate(['/register-ticket-success']);
      },
      complete: () => {
        setTimeout(() => (this.transport.progress = false), 3000);
      },
    });
  }
  public get(ticketId: string): Observable<unknown> {
    return this.apicall.get(`/ticket/${ticketId}`);
  }
}
