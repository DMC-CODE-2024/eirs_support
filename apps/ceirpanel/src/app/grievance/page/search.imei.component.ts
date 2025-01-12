/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SearchImeiModel } from '../../core/models/search.imdi.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'ceirpanel-search-imei',
  templateUrl: '../html/search-imei.component.html',
  styles: [``],
})
export class SearchImeiComponent implements OnInit {
  public imei: SearchImeiModel = {imei: ''} as SearchImeiModel;
  public cancel = false;
  url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  urlSafe!: SafeResourceUrl;

  constructor(
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private apicall: ApiUtilService,
    private router: Router,
    public sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
  onSubmit(userForm: NgForm) {
    this.router.navigate(['/search-imei/result']);
  }
  onOtpChange(event: unknown) {
    
  }
}
