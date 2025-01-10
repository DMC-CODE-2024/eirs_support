/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ClrDatagridStateInterface, ClrDatagridStringFilterInterface } from "@clr/angular";
import { DeviceList } from '../core/models/device-list.model';
import { Device } from '../core/models/device.model';
import { DeviceService } from '../core/services/device.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiUtilService } from '../core/services/common/api.util.service';


class PokemonFilter implements ClrDatagridStringFilterInterface<Device> {
  accepts(user: Device, search: string): boolean {
    return "" + user.stateInterp == search
      || user.stateInterp.toLowerCase().indexOf(search) >= 0;
  }
}
@Component({
  selector: 'ceirpanel-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css'],
  providers: [DeviceService],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceListComponent {
  public devices!: Device[];
  public total!: number;
  public loading = true;
  public pokemonFilter = new PokemonFilter();
  public selected: any[] = [];
  public state!: ClrDatagridStateInterface;
  url = 'https://lab1.goldilocks-tech.com/mdrportal/deviceManagement?featureId=55&userId=1367&userTypeId=25';
  urlSafe!: SafeResourceUrl;
  constructor(
    private deviceService: DeviceService, 
    private cdRef: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    private apicall: ApiUtilService) {
      this.apicall.get('/link/findByUrl/device').subscribe({  
        next: (data:any) => {
          this.url = data.iframeUrl;
          console.log('iframe url: ', this.url);
          this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        }
      });
  }
  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.state = state;
    console.log('state: ', this.state);
    this.cdRef.detectChanges();
    this.deviceService.pageView(state).subscribe({
      next: (result) => {
        this.devices = (result as DeviceList).content;
        this.total = (result as DeviceList).totalElements;
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (e) => {
        console.log('error', e);
      },
      complete: () => {
        console.log('error');
      }
    });
  }
}