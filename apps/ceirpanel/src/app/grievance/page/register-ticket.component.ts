/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm } from '@clr/angular';
import * as _ from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import { AlertComponent } from '../../core/components/alert.component';
import { PageType } from '../../core/constants/page.type';
import { GroupModel } from '../../core/models/group.model';
import { TicketModel } from '../../core/models/ticket.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { AuthService } from '../../core/services/common/auth.service';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { TicketService } from '../service/ticket.service';
import { ConfigService } from 'ng-config-service';
import { TranslateService } from '@ngx-translate/core';
import { JwtService } from '../../core/services/common/jwt.service';

@Component({
  selector: 'ceirpanel-register-ticket',
  templateUrl: '../html/register-ticket.component.html',
  styles: [
    `
      :host ::ng-deep .clr-combobox-wrapper {
        min-width: 95% !important;
      }
      :host ::ng-deep .input-group-sm>.btn, .input-group-sm>.form-control, .input-group-sm>.form-select, .input-group-sm>.input-group-text {
        font-size: 16px;
      }
    `,
  ],
  providers: [TicketService],
})
export class RegisterTicketComponent implements OnInit {
  public page: string = '' as string;
  public path: string = '' as string;
  public id: number = 0 as number;
  readonly = false;
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
  templateForm: object = { parentGroup: '' } as object;
  ticket: TicketModel = {category: '',province: '',district: '',commune: '',documentType: ''} as TicketModel;
  groups: Array<GroupModel> = [];
  public open = false;
  public cancel = false;
  public delete = false;
  documentFile!: File;
  imageObject: Array<any> = [] as Array<any>;
  categories: Array<any> = [] as Array<any>;
  public documentObject: Array<any> = [] as Array<any>;
  isLocalhost = true;
  siteKey!:string;
  allow = true;
  lang = 'us';
  header = 'yes';
  countryCode = '+855';
  mobileRegex!:string;
  @ViewChild(AlertComponent, { static: true }) private alert!: AlertComponent;
  error!:any;


  countries: Array<any> = [] as Array<any>;
  provinces: Array<any> = [] as Array<any>;
  districts: Array<any> = [] as Array<any>;
  communes: Array<any> = [] as Array<any>;
  villages: Array<any> = [] as Array<any>;
  documents: Array<any> = [] as Array<any>;
  duplicate = 'Duplicate';
  allowedFileUpload:Array<string> = [];
  public uploadMaxFile = 4;
  allowedFileUploadSize = 2000000;
  ticketFileTypeNotMatched = '';
  ticketFileSizeExceeded = '';
  ticketFileLimit = '';
  windowScrolled!: boolean;
  @ViewChild('document') fileinput!: ElementRef;
  
  constructor(
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private apicall: ApiUtilService,
    private router: Router,
    private transport: MenuTransportService,
    public permissionService: NgxPermissionsService,
    private ticketService: TicketService,
    public authService: AuthService,
    public config: ConfigService,
    public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private auth: AuthService,
    private jwtService: JwtService
  ) {
    translate.get('message.ticketFileTypeNotMatched').subscribe((res: string) => this.ticketFileTypeNotMatched = res);
    translate.get('message.ticketFileSizeExceeded').subscribe((res: string) => this.ticketFileSizeExceeded = res);
    translate.get('message.ticketFileLimit').subscribe((res: string) => this.ticketFileLimit = res);
    this.apicall.get('/config/frontend').subscribe({  
      next: (data:any) => {
        this.siteKey = data.siteKey;
        this.mobileRegex = data.mobileRegex;
      }
    });
    if(!authService.isLogin()) {
      this.apicall.get('/acl/isAllowInYourRegion').subscribe({
        next: (data:any) => {
          if(_.isEqual(_.get(data, 'servicedown'), 'yes')){
            this.router.navigate(['/region-service-not-available'],{queryParams:{lang: this.lang,header: this.header,titlefromcache:'yes'}});
          } else if (_.isEqual(_.get(data, 'allow'), 'no')) {
            this.router.navigate(['/region-denied'],{queryParams:{lang: this.lang,header: this.header,titlefromcache:'yes'}});
          }
        }
      });
    }
    this.isLocalhost = this.document.location.host.includes('localhost');
    if(!authService.isLogin()) {
      permissionService.addPermission('TICKET_ATTACHMENT');
      permissionService.addPermission('ATTACHMENT');
    }
    
  }

  ngOnInit(): void {
    this.scrollToTop();
    this.allowedFileUpload = this.config.get('allowedFileUpload') || [];
    this.uploadMaxFile = this.config.get('uploadMaxFile') || 4;
    this.allowedFileUploadSize = this.config.get('allowedFileUploadSize') || 2000000;
    this.countryCode = this.config.get('countryCode') || '+855';
    this.countryCode = _.startsWith(this.countryCode, '+') ? this.countryCode.substring(1, this.countryCode.length) : this.countryCode;
    this.route.queryParams.subscribe(queryParams => {
      this.lang = queryParams['lang'] || 'us';
      this.header = queryParams['header'] || 'yes';
      const msisdn = _.trim(queryParams['msisdn'] || '');
      this.ticket.mobileNumber = _.startsWith(msisdn, this.countryCode) ? msisdn.substring(this.countryCode.length, msisdn.length) : msisdn;
    });
    this.duplicate = this.config.get('duplicate') || 'Duplicate';
    this.path = this.route.snapshot.url[0].path;
    this.page = this.route.snapshot.paramMap.get('page') || '';
    this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
    if (this.page === PageType.view) {
      this.readonly = true;
    }
    this.findCategories();
    if (this.id > 0) {  
      this.apicall.get(`/ticket/${this.id}`).subscribe({
        next: (data) => {
          this.ticket = data as TicketModel;
        }
      });
    }
    this.findAddressLine();
    this.findDocumentList();
  }
  scrollToTop(): void {
    this.document.getElementsByClassName('content-area')[0].scrollTo(0,0);
  }
  onSubmit(userForm: NgForm) {
    if (userForm.invalid) {
      this.clrForm.markAsTouched();
      return;
    }
    this.save();
  }
  save() {
    this.transport.progress = true;
    const formData: FormData = new FormData();
    const objmap = {} as any;
    this.documentObject.forEach((d) => {
      formData.append('documents', d.file);
      objmap[d.name] = d.documentType; 
    });
    console.log('ticket: ', this.ticket)
    const request: TicketModel = JSON.parse(JSON.stringify(this.ticket));
    request.mobileNumber = _.isNumber(request.mobileNumber) ? `${this.countryCode}${request.mobileNumber}` : '';
    if(!_.isEmpty(request.alternateMobileNumber)) {
      request.alternateMobileNumber = `${this.countryCode}${request.alternateMobileNumber}`;
    }
    const obj = _.find(this.categories, {id: this.ticket.category});
    request.categoryId = _.isEmpty(obj) ? '' :  obj.id;
    request.category = _.isEmpty(obj) ? '' :  obj.name;
    this.ticketService.putData(formData, request);
    
    const iframelogin = this.jwtService.getIframeLogin();
    if (!_.isEmpty(iframelogin) && !_.isEmpty(iframelogin.token)) {
      this.header = iframelogin.header;
    }
    formData.append('fileWithDocuments', JSON.stringify(objmap));
    formData.append('language', _.isEmpty(localStorage.getItem(`${window.name}lang`) || 'us') ? 'us' : localStorage.getItem(`${window.name}lang`) || 'us');
    this.apicall.post('/ticket/save', formData).subscribe({
      next: (_data) => {
        if (_.isEqual(_.get(_data, 'message'), 'registerTicketFailed')) {
          this.error = {type: 'danger', message: _.get(_data,'message')};
          this.scrollToTop();
          setTimeout(() => this.error = null, 10000);
        } else {
          if(this.auth.isLogin()) {
            if(_.isEqual(this.page, 'ticket')) {
              this.router.navigate(['/ticket/register-ticket-success',(_data as any).ticketId],{queryParams:{lang: this.lang,header:this.header}});
            } else {
              this.router.navigate(['/register-ticket/register-ticket-success',(_data as any).ticketId,],{queryParams:{lang: this.lang,header:this.header}});
            }
          } else {
            this.router.navigate(['/ticket/register-ticket-success',(_data as any).ticketId,],{queryParams:{lang: this.lang,header:this.header}});
          }
        }
      },
      complete: () => {
        console
      }
    })
  }
  openClose(open: boolean) {
    this.open = open;
  }
  cancelOpenClose(cancel: boolean) {
    this.cancel = false;
    if (cancel == true) this.router.navigate([this.path]);
  }
  findCategories() {
    this.apicall
      .get('/ticket/category')
      .subscribe({ next: (result) => (this.categories = result as any[]) });
  }
  documentSelect(event: any) {
    const messages:Array<string> = [];
    for (let i = 0; i < event.target.files.length; i++) {
      const fileobj = this.objForFile(event.target.files[i]);
      if(_.includes(this.allowedFileUpload, event.target.files[i].type)==false) {
        messages.push(this.ticketFileTypeNotMatched);
      } else if(event.target.files[i].size > this.allowedFileUploadSize) {
        messages.push(this.ticketFileSizeExceeded);
      } else if(this.documentObject.length >= this.uploadMaxFile) {
        messages.push(this.ticketFileLimit);
      } else {
        if(!_.find(this.documentObject, {name: fileobj.name, lastModified: fileobj.lastModified, size: fileobj.size})) {
          this.documentObject.push(fileobj);
        }
      }
    }
    this.fileinput.nativeElement.value = null;
    if(messages.length > 0 ) {
      this.alert.messages = messages;
      this.alert.open = true;
    }
  }
  private objForFile(file: File) {
    const localImageUrl = window.URL
        ? window.URL.createObjectURL(file)
        : (window as any).webkitURL.createObjectURL(file);
    return {
      file: file,
      image: localImageUrl,
      thumbImage: localImageUrl,
      name: file.name,
      size: this.formatBytes(file.size),
      type: file.type,
      lastModified: file.lastModified,
      documentType: this.ticket.documentType
    }
  }
  formatBytes(bytes: number){
    const kb = 1024;
    const ndx = Math.floor( Math.log(bytes) / Math.log(kb) );
    const fileSizeTypes = ["bytes", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];
  
    return {
      size: +(bytes / kb / kb).toFixed(2),
      type: fileSizeTypes[ndx]
    };
  }
  resolved(captchaResponse: string) {
   
  }
  findAddressLine() {
    this.apicall.get('/country/list').subscribe({
      next: (result) => { 
        this.countries = (result as Array<any>);
        this.provinces = _.get(_.find(this.countries,{name: 'Cambodia'}),'provinces',[]);
      }
    });
  }
  findDocumentList(){
    this.apicall.get('/ticket/document/list').subscribe({
      next: (result) => { 
        (result as Array<any>).forEach(a => this.documents.push(a));
      }
    });
  }
  onProvinceChange($event: any){
    this.districts = _.get(_.find(this.provinces,{name: $event.target.value}),'districts',[]);
  }
  onDistrictChange($event: any){
    this.communes = _.get(_.find(this.districts,{name: $event.target.value}),'communes',[]);
  }
  onCategoryChange($event: any){
    const category = _.find(this.categories, {id: $event.target.value});
    this.ticket.categoryId = _.get(category,'id',0);
    this.ticket.categoryName = _.get(category,'name','');
  }
}
