/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { Options } from 'ngx-qrcode-styling';
import { DOCUMENT } from '@angular/common';
import { ConfigService } from 'ng-config-service';

@Injectable({
  providedIn: 'root',
})
export class QrcodeService {
  public config: Options = {
    width: 180,
    height: 180,
    data: 'http://localhost:4200/#/view-ticket-thread',
    image: 'assets/images/logo.png',
    margin: 0,
    dotsOptions: {
      color: '#000000',
      type: 'dots',
    },
    backgroundOptions: {
      color: '#CF1B22',
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 0,
    },
  };
  constructor(
    private apicall: ApiUtilService,
    private transport: MenuTransportService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public configService: ConfigService,
    @Inject(DOCUMENT) private document: any
  ) {
    
  }
  public get(ticketId: string): Options {
    const arr = this.router.url.split('?');
    const queryParams = arr.length > 1 ? arr[1]: '';
    const uri = this.document.location.pathname.split('/')[1];
    this.config.data = `${this.document.location.protocol}//${this.document.location.host}/${uri}/ticket/ticket-thread/${ticketId}?${queryParams}`;
    this.config.image = this.configService.get('logo') || 'assets/images/logo.png';
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.config!.backgroundOptions!.color = this.configService.get('captchaBg') || '#ffffff';
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.config!.dotsOptions!.color = this.configService.get('captchaColor') || '#000000';

    return this.config;
  }
}
