import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import * as _ from 'lodash';
import { ConfigService } from 'ng-config-service';



@Component({
  selector: 'ceirpanel-xcally-ticket-status',
  template: `
  `,
  styles: [``],
})
export class XcallyCheckTicketStatusComponent implements OnInit {
    msisdn!:string;
    countrycode!:string;
  constructor(
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private apicall: ApiUtilService,
    private router: Router,
    public sanitizer: DomSanitizer,
    private apiutil: ApiUtilService,
    public config: ConfigService
  ) {}
  ngOnInit(): void {
    this.countrycode = this.config.get('countryCode') || '+265';
    this.countrycode = _.startsWith(this.countrycode, '+') ? this.countrycode.substring(1, this.countrycode.length) : this.countrycode;
    this.route.queryParams.subscribe(queryParams => {
        this.msisdn = queryParams['msisdn'] || '';
        this.apiutil.get('/api/auth/isLogin').subscribe({
            next: (data) => {
              if (_.isEqual(_.get(data, 'login'), false)) {
                this.router.navigate(['/'],{queryParams:{msisdn: this.msisdn,redirect:'register'}});
              } else {
                this.router.navigate(['/check-ticket-status'],{queryParams:{msisdn: this.msisdn,redirect:'register'}});
              }
            }
          });
    });
  }
}
