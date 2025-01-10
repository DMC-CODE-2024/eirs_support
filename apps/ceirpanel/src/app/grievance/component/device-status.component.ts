import { ChangeDetectorRef, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ExtendableListComponent } from '../../ceir-common/extendable-list';
import { TicketModel } from '../../core/models/ticket.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { ExportService } from '../../core/services/common/export.service';
import { DeviceService } from '../../core/services/device.service';

@Component({
  selector: 'ceirpanel-device-status',
  template: `
    <table class="table">
      <thead class="text-bg-info">
        <tr>
          <th class="left text-bg-info text-white">Status</th>
          <th class="text-bg-info text-white">Date</th>
          <th class="text-bg-info text-white">Status</th>
          <th class="text-bg-info text-white">View</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="left">1</td>
          <td>1</td>
          <td>1</td>
          <td>
            <button class="btn btn-link btn-sm m-0 p-0" [routerLink]="['/ticket/ticket-thread']">
              <cds-icon shape="eye"></cds-icon>
            </button>
          </td>
        </tr>
        <tr>
          <td class="left">1</td>
          <td>1</td>
          <td>1</td>
          <td>
            <button class="btn btn-link btn-sm m-0 p-0" [routerLink]="['/ticket/ticket-thread']">
              <cds-icon shape="eye"></cds-icon>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
  .text-bg-info {
    background-color: #1E4076 !important;
  }
  `],
})
export class DeviceStatusComponent  extends ExtendableListComponent  {
    public tickets!: TicketModel[];
    public total!: number;
    public loading = true;
  
    constructor(
      private deviceService: DeviceService,
      private cdRef: ChangeDetectorRef,
      private translate: TranslateService,
      private apicall: ApiUtilService,
      public exportService: ExportService) {
      super();
    }
}
