import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'ceirpanel-status',
  template: `
    <span *ngIf="!status ||status==='0'" class="badge badge-info">{{ "status.inactive"| translate }}</span>
    <span *ngIf="status==='3'" class="badge badge-success">{{ "status.active"| translate }}</span>
    <span *ngIf="status==='4'" class="badge badge-warning">{{ "status.suspended"| translate }}</span>
    <span *ngIf="status==='5'" class="badge">{{ "status.locked"| translate }}</span>
    <span *ngIf="status==='21'" class="badge badge-danger">{{ "status.deleted"| translate }}</span>
  `,
  styles: [``],
})
export class StatusComponent {
  @Input() status = '0';
  constructor(private translate: TranslateService){}
}
