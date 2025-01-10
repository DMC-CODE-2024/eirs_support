import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Device } from '../core/models/device.model';
import { DeviceService } from '../core/services/device.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ceirpanel-device-add',
  templateUrl: './device-add.component.html',
  styleUrls: ['./device-add.component.css'],
  providers: [
    DeviceService
  ],
  standalone: false
})
export class DeviceAddComponent implements OnInit, AfterViewInit {
  device: Device = {} as Device;
  public open = false;
  public page: string = '' as string;

  constructor(public translate: TranslateService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.page = this.route.snapshot.paramMap.get('page') || '';
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  confirmation() {
    this.open = true;
  }
  openClose(open: boolean) {
    this.open = open;
  }
}
