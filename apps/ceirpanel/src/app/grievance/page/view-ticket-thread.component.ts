/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClrForm } from '@clr/angular';
import * as _ from 'lodash';
import { ConfigService } from 'ng-config-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Options } from 'ngx-qrcode-styling';
import { AlertComponent } from '../../core/components/alert.component';
import { SearchImeiModel } from '../../core/models/search.imdi.model';
import { TicketAttachment, TicketModel, TicketNoteDto } from '../../core/models/ticket.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { AuthService } from '../../core/services/common/auth.service';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { TicketResolveComponent } from '../component/ticket-resolve.component';
import { TicketService } from '../service/ticket.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ceirpanel-view-ticket-thread',
  templateUrl: '../html/view-ticket-thread.component.html',
  styles: [`
  .subjectline {
    font-size:11px;
    color:#828282;
    margin-right: .6rem !important;
  }
  .green {
    color: #04C100;
  }
  .blue {
    color: #2F80ED;
  }
  .text-secondary {
    color: #828282 !important;
  }
  .h5, h5 {
    font-size: .8rem !important;
  }
  `],
})
export class ViewTicketThreadComponent implements OnInit {
  imei: SearchImeiModel = {} as SearchImeiModel;
  public cancel = false;
  public config: Options = {};
  public ticketId!: string;
  public ticket: TicketModel = {
    subject: 'Not accessible',
    createdOn: '2023-10-24 19:05:09',
    updatedOn: '2023-10-24 19:05:09',
    raisedBy: 'Vivek Kumar',
    category: 'Mobile',
    currentStatus: 'In progress',
    description:'End user’s',
  } as any;
  public notes: TicketNoteDto = { visibility: 'private' } as any;

  public documentObject: Array<any> = [] as Array<any>;
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
  public open = false;
  public feedback = false;
  @ViewChild(TicketResolveComponent) private ticketResoved!: TicketResolveComponent;
  @ViewChild("f") public ngForm!: NgForm;
  endUsers: Array<any> = [];
  allowStatusForComments: Array<any> = [];
  documents: Array<any> = [] as Array<any>;
  @ViewChild(AlertComponent, { static: true }) private alert!: AlertComponent;
  @ViewChild('document') fileinput!: ElementRef;
  ticketupload: Array<any> = [];
  allowedFileUpload:Array<string> = [];
  public uploadMaxFile = 4;
  allowedFileUploadSize = 2000000;
  ticketFileTypeNotMatched = '';
  ticketFileSizeExceeded = '';
  ticketFileLimit = '';
  header = 'yes';
  lang = 'us';
  msisdn!: string;
  redirect!: string;
  lodash = _;
  countryCode = '+855';

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private apicall: ApiUtilService,
    private transport: MenuTransportService,
    public authService: AuthService,
    public permissionService: NgxPermissionsService,
    public _location: Location,
    public cnf: ConfigService,
    private translate: TranslateService
  ) {
    this.countryCode = this.cnf.get('countryCode') || '+855';
    this.countryCode = _.startsWith(this.countryCode, '+') ? this.countryCode.substring(1, this.countryCode.length) : this.countryCode;
    translate.get('message.ticketFileTypeNotMatched').subscribe((res: string) => this.ticketFileTypeNotMatched = res);
    translate.get('message.ticketFileSizeExceeded').subscribe((res: string) => this.ticketFileSizeExceeded = res);
    translate.get('message.ticketFileLimit').subscribe((res: string) => this.ticketFileLimit = res);
    this.ticketId = this.route.snapshot.paramMap.get('ticketId') || '';
    this.route.queryParams.subscribe(queryParams => {
      this.lang = queryParams['lang'] || 'us';
      this.header = queryParams['header'] || 'yes';
      this.msisdn = queryParams['msisdn'] || '';
      this.redirect = queryParams['redirect'] || '';
    });
  }
  ngOnInit(): void {
    this.allowedFileUpload = this.cnf.get('allowedFileUpload') || [];
    this.uploadMaxFile = this.cnf.get('uploadMaxFile') || 4;
    this.allowedFileUploadSize = this.cnf.get('allowedFileUploadSize') || 2000000;
    this.endUsers = this.cnf.get('endUsers') || [];
    this.allowStatusForComments = this.cnf.get('allowStatusForComment') || [];
    this.notes = { visibility: this.permissionService.getPermission('TICKET_VISIBILITY') ? 'private': 'public' } as any;
    if (!_.isEmpty(this.ticketId)) {
      this.ticketService.get(this.ticketId).subscribe({
        next: (result) => {
          this.ticket = (result as any).data as TicketModel;
          this.ticket.mobileNumber = _.isEmpty(this.ticket.mobileNumber) || this.ticket.mobileNumber === 'NULL' ? '': this.ticket.mobileNumber;
          if(!_.isEmpty(this.ticket.mobileNumber) && this.ticket.mobileNumber !== 'NULL') {
            this.ticket.mobileNumber = _.startsWith(this.ticket.mobileNumber, '+') ? this.ticket.mobileNumber.substring(1, this.ticket.mobileNumber.length) : this.ticket.mobileNumber;
            this.ticket.mobileNumber = `+${_.startsWith(this.ticket.mobileNumber, this.countryCode) ? this.ticket.mobileNumber : this.countryCode + this.ticket.mobileNumber}`;
          }
          this.getTicketUpload();
          if(_.isEmpty(this.ticket.documentType)) {
            this.ticket.documentType = '';
          }
        },
      });
    }
    this.findDocumentList();
  }
  private getTicketUpload() {
    const details: Array<any> = [];
    const uploads: Array<any> = [];
    this.ticket.issue.journals.forEach(j => {
      j.details.forEach(d => {
        const uobj:any = _.find(this.ticket.issue.uploads, {id: Number(d.name)});
        d.description = _.isEmpty(uobj) ? '' : uobj.description;
        d.contentUrl = this.makeContentUrl(d.contentUrl);
        details.push({id: Number(d.name), filename: d.filename, filesize: d.filesize,contentUrl: d.contentUrl});
      });
    });
    this.ticket.issue.uploads.forEach(d => {
      d.contentUrl = this.makeContentUrl(d.contentUrl);
      uploads.push({id: Number(d.id), filename: d.filename, filesize: d.filesize,contentUrl: d.contentUrl, description: d.description});
    });
    this.ticketupload = _.xorBy(uploads, details,'id');
  }
  private makeContentUrl(contentUrl: string) {
    const array = _.split(contentUrl, '/');
    const url = `${this.cnf.get('redmineDownloaderApi')  || ''}/${array[array.length - 2]}` ;
    return url;
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
  formatBytes(bytes: number){
    const kb = 1024;
    const ndx = Math.floor( Math.log(bytes) / Math.log(kb) );
    const fileSizeTypes = ["bytes", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];
  
    return {
      size: +(bytes / kb / kb).toFixed(2),
      type: fileSizeTypes[ndx]
    };
  }
  onSubmit(userForm: NgForm) {
    if (userForm.invalid) {
      this.clrForm.markAsTouched();
      return;
    }
    this.saveNote();
  }
  saveNote() {
    const formData: FormData = new FormData();
    const objmap = {} as any;
    this.documentObject.forEach((d) => {
      formData.append('documents', d.file);
      objmap[d.name] = d.documentType; 
    });
    const privateNotes:any = _.isEmpty(this.notes.visibility) ? false: _.isEqual(this.notes.visibility, 'public') ? false: true;
    formData.append('notes', this.notes.notes);
    formData.append('ticketId', this.ticketId);
    formData.append('privateNotes', privateNotes);
    formData.append('fileWithDocuments', JSON.stringify(objmap));
    this.apicall.post(`/ticket/save/note`, formData).subscribe({
      next: (_data) => {
        this.transport.alert = {
          message: 'registerTicketSuccess',
          type: 'info',
        } as unknown;
        this.ticket = _data as TicketModel;
        this.ticket.issue.journals = _.sortBy(this.ticket.issue.journals, ['createdOn'], 'asc');
        this.ticket.documentType = '';
        this.documentObject = [];
        this.getTicketUpload();
      },
      complete: () => {
        setTimeout(() => (this.transport.progress = false), 3000);
        this.notes = { visibility: this.authService.isLogin() ? 'private': 'public' , notes: ''} as any;
      },
    });
  }
  resolve(event: any) {
    this.open = event.open;
    const formData: FormData = new FormData();
    formData.append('notes', event.notes);
    formData.append('ticketId', this.ticketId);
    formData.append('privateNotes', true as any);
    if (_.isEqual(event.resolve, 'yes')) {
      this.apicall.get(`/ticket/resolve/${this.ticketId}`).subscribe({
        next: (_res) => {
          this.ticket = _res as TicketModel;
          event.notes = _.isEmpty(event.notes) ? '': event.notes;
          this.apicall.post(`/ticket/save/note`, formData).subscribe({
            next: (_data) => {
              this.ticket = _data as TicketModel;
              this.notes = { visibility: this.authService.isLogin() ? 'private': 'public' , notes: ''} as any;
              if(!this.authService.isLogin()) {
                setTimeout(() => this.openFeedback(true), 3000);
              }
            }
          });
        },
      });
    }
  }
  endUserFeedback(event: any) {
    this.feedback = event.open;
    if (_.isEqual(event.resolve, 'yes')) {
      this.apicall.post(`/ticket/save/rate`, {feedback: event.feedback, ratings: event.ratings, ticketId: this.ticketId}).subscribe({
        next: () => {
          
        },
      });
    }
  }
  openResolved(open: boolean) {
    this.ticketResoved.ngForm.reset();
    this.open = open;
  }
  openFeedback(open: boolean) {
    this.feedback = open;
  }
  get sortData() {
    return this.ticket.issue.journals.sort((a, b) => {
      return <any>new Date(b.createdOn) - <any>new Date(a.createdOn);
    });
  }
  getIds(details: Array<TicketAttachment>){
    const ids: Array<string> = [];
    details.forEach(d => ids.push(d.name));
    return details;
  }
  findDocumentList(){
    this.apicall.get('/ticket/document/list').subscribe({
      next: (result) => { 
        this.documents = (result as Array<any>);
      }
    });
  }
  isEmpty(str: string) {
    return _.isEmpty(str);
  }
}
