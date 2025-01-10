/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Output } from '@angular/core';
import { MenuTransportService } from '../core/services/common/menu.transport.service';

@Component({
  standalone: false,
  selector: 'ceirpanel-app-alert',
  providers: [MenuTransportService],
  template: `
    <clr-alerts class="mt-2 mb-2">
      <clr-alert
        *ngFor="let alert of alerts"
        [clrAlertType]="alert.type"
        [clrAlertAppLevel]="true"
      >
        <clr-alert-item>
          <span class="alert-text text-white">{{ "message." + alert.message | translate }}</span>
        </clr-alert-item>
      </clr-alert>
    </clr-alerts>
  `,
})
export class AppAlertComponent {
  @Output() public main: EventEmitter<any> = new EventEmitter();
  public collapse = false;
  alerts: Set<any> = new Set<any>();
  constructor(public menuTransport: MenuTransportService) {}
  
  public put(alert: any) {
    this.alerts.add(alert);
    setTimeout(() => this.alerts.delete(alert), 4500);
  }

}
