import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '../../core/models/device.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';

@Component({
  selector: 'ceirpanel-search-imei-result',
  templateUrl: '../html/search-imei.result.component.html',
  styles: [``],
})
export class SearchImeiResultComponent implements OnInit {
  device: Device = {} as Device;
  public cancel = false;

  constructor(
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private apicall: ApiUtilService,
    private router: Router
  ) {}
  ngOnInit(): void {
    console.log();
  }
  onSubmit(userForm: NgForm) {
    console.log(userForm);
  }
  onOtpChange(event: unknown) {
    console.log(event);
  }
}
