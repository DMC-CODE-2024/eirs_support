/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm, ClrStepButton, ClrStepper } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { ConfigService } from 'ng-config-service';
import { Observable, take } from 'rxjs';
import { AlertComponent } from '../../core/components/alert.component';
import { PageType } from '../../core/constants/page.type';
import { Address, Contact, Id, Name, Password, Reporting, Security, UserCreate } from '../../core/models/user-create.model';
import { UserModel } from '../../core/models/user.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { UserService } from '../service/user.service';


@Component({
  selector: 'ceirpanel-user-add',
  templateUrl: '../html/user-add.component.html',
  styles: [`
  :host ::ng-deep .clr-input-group {
    width: 100% !important;
  }
  `],
  providers: []
})
export class UserAddComponent implements OnInit, AfterViewInit {
  initialStep = 'name';
  steps = ['name', 'address', 'id', 'reporting', 'password', 'contact', 'security'];
  @ViewChild(ClrStepButton, { static: false }) stepButton!: ClrStepButton;
  @ViewChild(ClrStepper, { static: false }) clrStepper!: ClrStepper;
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
  @ViewChild(AlertComponent, { static: true }) private alert!: AlertComponent;
  @ViewChild('nidFile') nidFileInput!: ElementRef;
  @ViewChild('userPhoto') userPhotoInput!: ElementRef;
  @ViewChild('idFile') idFileInput!: ElementRef;
  readonly = false;
  public page: string = '' as string;
  public path: string = '' as string;
  public id: number = 0 as number;
  public cancel = false;
  public questions: Array<any> = [];
  public alreadyExist = true;
  public idCardFile!: File;
  public nidFile!: File;
  public photoFile!: File;
  public orgemail = '';
  public orgmsisdn = '';
  url = '/user';
  idCardObject: Array<any> = [] as Array<any>;
  nidCardObject: Array<any> = [] as Array<any>;
  photoObject: Array<any> = [] as Array<any>;
  countries: Array<any> = [] as Array<any>;
  provinces: Array<any> = [] as Array<any>;
  districts: Array<any> = [] as Array<any>;
  communes: Array<any> = [] as Array<any>;
  villages: Array<any> = [] as Array<any>;
  error!:any;
  nationalIdRegex!:string;
  postalCodeRegex!:string;
  allowedNidFileUpload:Array<string> = [];
  allowedNidFileUploadSize = 2000000;
  ticketNidFileTypeNotMatched = '';
  ticketNidFileSizeExceeded = '';

  allowedUserFileUpload:Array<string> = [];
  allowedUserFileUploadSize = 2000000;
  ticketUserFileTypeNotMatched = '';
  ticketUserFileSizeExceeded = '';

  allowedUserEmpIdCardFileUpload:Array<string> = [];
  allowedUserEmpIdCardFileUploadSize = 2000000;
  userEmpIdCardFileTypeNotMatched = '';
  userEmpIdCardFileSizeExceeded = '';

  templateForm: UserCreate = {
    name: { firstName: '', lastName: '' } as Name, address: {country:'',province:'',district:'',commune:'', village:''} as Address, 
    id: {} as Id, reporting: {} as Reporting,
    password: {} as Password, contact: {} as Contact, security: { question1: 0, question2: 0, question3: 0 } as Security
  } as UserCreate;

  constructor(
    private userService: UserService,
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private apicall: ApiUtilService,
    private router: Router,
    private transport: MenuTransportService,
    private el: ElementRef,
    public translate: TranslateService,
    public cnf: ConfigService,
    @Inject(DOCUMENT) private document: Document
  ) { 
    translate.get('message.userNidFileTypeNotMatched').subscribe((res: string) => this.ticketNidFileTypeNotMatched = res);
    translate.get('message.userNidFileSizeExceeded').subscribe((res: string) => this.ticketNidFileSizeExceeded = res);
    translate.get('message.userFileTypeNotMatched').subscribe((res: string) => this.ticketUserFileTypeNotMatched = res);
    translate.get('message.userFileSizeExceeded').subscribe((res: string) => this.ticketUserFileSizeExceeded = res);
    translate.get('message.userEmpIdCardFileTypeNotMatched').subscribe((res: string) => this.userEmpIdCardFileTypeNotMatched = res);
    translate.get('message.userEmpIdCardFileSizeExceeded').subscribe((res: string) => this.userEmpIdCardFileSizeExceeded = res);
  }

  ngOnInit(): void {
    this.allowedNidFileUpload = this.cnf.get('allowedNidFileUpload') || [];
    this.allowedNidFileUploadSize = this.cnf.get('allowedNidFileUploadSize') || 2000000;
    this.allowedUserFileUpload = this.cnf.get('allowedUserFileUpload') || [];
    this.allowedUserFileUploadSize = this.cnf.get('allowedUserFileUploadSize') || 2000000;
    this.allowedUserEmpIdCardFileUpload = this.cnf.get('allowedUserEmpIdCardFileUpload') || [];
    this.allowedUserEmpIdCardFileUploadSize = this.cnf.get('userEmpIdCardFileSizeExceeded') || 2000000;

    this.nationalIdRegex = this.cnf.get('nationalIdRegex') || '';
    this.postalCodeRegex = this.cnf.get('postalCodeRegex') || '';
    this.path = this.route.snapshot.url[0].path;
    this.page = this.route.snapshot.paramMap.get('page') || '';
    this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
    this.route.queryParams.subscribe((queryParams) => {
      this.url = queryParams['url'] || '/user';
    });
    this.initializeStep();
    this.readonly = this.page === 'view' ? true: false;
    if (this.id > 0) {
      this.userService.view(this.id).pipe(take(1)).subscribe((obj: UserModel) => {
        this.orgemail = obj.profile.email;
        this.orgmsisdn = obj.profile.phoneNo;
        this.templateForm = this.userService.getUserCreateObj(obj);
        this.findCountries();//this.findQuestions();
        this.nidCardObject = this.userService.getNidCardObject(obj);
        this.idCardObject = this.userService.getIdCardObject(obj);
        this.photoObject = this.userService.getPhotoObject(obj);
      });
    } else {
      this.findCountries();
      //this.findQuestions();
    }
  }
  onNidSelect(event: any) {
    const messages:Array<string> = [];
    this.nidCardObject = [];
    if(_.includes(this.allowedNidFileUpload, event.target.files[0].type)==false) {
      messages.push(this.ticketNidFileTypeNotMatched);
    } else if(event.target.files[0].size > this.allowedNidFileUploadSize) {
      messages.push(this.ticketNidFileSizeExceeded);
    } else {
      this.nidFile = event.target.files[0];
      const localImageUrl = (window.URL) ? window.URL.createObjectURL(this.nidFile) : (window as any).webkitURL.createObjectURL(this.nidFile);
      this.nidCardObject.push({ image:localImageUrl , thumbImage:localImageUrl });
    }
    this.nidFileInput.nativeElement.value = null;
    if(messages.length > 0 ) {
      this.alert.messages = messages;
      this.alert.open = true;
    }
  }
  onUserPhotoSelect(event: any) {
    const messages:Array<string> = [];
    this.photoObject = [];
    if(_.includes(this.allowedUserFileUpload, event.target.files[0].type)==false) {
      messages.push(this.ticketUserFileTypeNotMatched);
    } else if(event.target.files[0].size > this.allowedUserFileUploadSize) {
      messages.push(this.ticketUserFileSizeExceeded);
    } else {
      this.photoFile = event.target.files[0];
      const localImageUrl = (window.URL) ? window.URL.createObjectURL(this.photoFile) : (window as any).webkitURL.createObjectURL(this.photoFile);
      this.photoObject.push({ image: localImageUrl, thumbImage: localImageUrl });
    }
    this.userPhotoInput.nativeElement.value = null;
    if(messages.length > 0 ) {
      this.alert.messages = messages;
      this.alert.open = true;
    }
  }
  onIdSelect(event: any) {
    const messages:Array<string> = [];
    this.idCardObject = [];
    if(_.includes(this.allowedUserEmpIdCardFileUpload, event.target.files[0].type)==false) {
      messages.push(this.userEmpIdCardFileTypeNotMatched);
    } else if(event.target.files[0].size > this.allowedUserEmpIdCardFileUploadSize) {
      messages.push(this.userEmpIdCardFileSizeExceeded);
    } else {
      this.idCardFile = event.target.files[0];
      const localImageUrl = (window.URL) ? window.URL.createObjectURL(this.idCardFile) : (window as any).webkitURL.createObjectURL(this.idCardFile);
      this.idCardObject.push({ image: localImageUrl, thumbImage: localImageUrl });
    }
    this.idFileInput.nativeElement.value = null;
    if(messages.length > 0 ) {
      this.alert.messages = messages;
      this.alert.open = true;
    }
    
  }
  ngAfterViewInit(): void {
    this.cdref.detectChanges();
    this.el.nativeElement.querySelector('input[type="password"]').setAttribute('autocomplete', 'new-password');
    this.toggleOn();
  }

  initializeStep() {
    this.steps.forEach(step => this.initialStep = step);
  }

  toggleOn() {
    this.readonly = this.page == PageType.view;
    this.clrStepper.panels.forEach(pannel => {
      if (this.steps.indexOf(pannel.id) > -1) {
        pannel.togglePanel();
      }
    });
    this.cdref.detectChanges();
  }
  onSubmit(userForm: NgForm) {
    console.log('invalid: ',userForm.invalid);
    if (userForm.invalid) { this.clrForm.markAsTouched(); return; }
    this.save();
  }
  putData(formData: FormData, feature: any) {
    const filters: any[] = [];
    Object.keys(feature).forEach((key) => {
      filters.push({ property: key, value: feature[key] });
      formData.append(key, feature[key]);
    });
  }
  save() {
    const obj: object = Object.assign(this.templateForm.name, this.templateForm.address,
      this.templateForm.contact, this.templateForm.id, this.templateForm.password, this.templateForm.reporting,
      this.templateForm.security);
    this.transport.progress = true;
    const formData: FormData = new FormData();
    if(this.nidFile)formData.append('nidFile', this.nidFile);
    if(this.idCardFile)formData.append('idCardFile', this.idCardFile);
    if(this.photoFile)formData.append('photoFile', this.photoFile);
    this.putData(formData, obj);
    const form: FormData = new FormData();
    formData.forEach((v,k) => {if(!_.isNull(v) && !_.isEqual(v,'null'))form.append(k,v);});
    
    const observable: Observable<unknown> = this.page == PageType.edit ? this.userService.update(this.id, form) : this.userService.save(form);

    observable.subscribe((_data) => {
      console.log('response: ', _data);
      console.log('Matched: ', _.isEqual(_.get(_data, 'status'), 'failed'));
      if (_.isEqual(_.get(_data, 'status'), 'failed')) {
        this.error = {type: 'danger', message: _.get(_data,'message')};
        this.scrollToTop();
        setTimeout(() => this.error = null, 10000);
      } else {
        this.transport.alert = {type: 'success', message: _.get(_data,'body.message')};
        setTimeout(() => this.transport.progress = false, 3000);
        if (this.id > 0) {
          if(!_.isEqual(this.orgmsisdn, this.templateForm?.contact?.phoneNo) && !_.isEqual(this.orgemail, this.templateForm?.contact?.email)){
            this.router.navigate(['/email-mobile-verification',this.id,this.templateForm.contact.email,this.templateForm.contact.phoneNo],{queryParams: {url:this.url}});
          } else if(!_.isEqual(this.orgmsisdn, this.templateForm?.contact?.phoneNo)){
            this.router.navigate(['/email-mobile-verification',this.id,this.orgemail,this.templateForm.contact.phoneNo],{queryParams: {url:this.url}});
          } else if(!_.isEqual(this.orgemail, this.templateForm?.contact?.email)){
            this.router.navigate(['/email-mobile-verification',this.id,this.templateForm.contact.email,this.orgmsisdn],{queryParams: {url:this.url}});
          } else {
            this.router.navigate(['/user']);
          }
        } else {
          this.router.navigate(['/user']);
        }
      }
    });
    this.cdref.detectChanges();
  }
  scrollToTop(): void {
    this.document.getElementsByClassName('content-area')[0].scrollTo(0,0);
  }
  cancelOpenClose(cancel: boolean) {
    this.cancel = false;
    if (cancel == true) this.router.navigate([this.path]);
  }
  
  findCountries() {
    this.apicall.get('/country/list').subscribe({
      next: (result) => { 
        this.countries = (result as Array<any>);
        this.provinces = _.get(_.find(this.countries,{name: this.templateForm.address.country}),'provinces',[]);
        this.districts = _.get(_.find(this.provinces,{id: Number(this.templateForm.address.province)}),'districts',[]);
        this.communes = _.get(_.find(this.districts,{id: Number(this.templateForm.address.district)}),'communes',[]);
        this.villages = _.get(_.find(this.communes,{id: Number(this.templateForm.address.commune)}),'villages',[]);
      }
    });
  }
  onCountryChange($event: any){
    this.provinces = _.get(_.find(this.countries,{name: $event.target.value}),'provinces',[]);
    console.log('country change proviences: ', $event.target.value);
  }
  onProvinceChange($event: any){
    this.districts = _.get(_.find(this.provinces,{id: Number($event.target.value)}),'districts',[]);
    console.log('provience change districts: ', $event.target.value);
  }
  onDistrictChange($event: any){
    this.communes = _.get(_.find(this.districts,{id: Number($event.target.value)}),'communes',[]);
    console.log('district change communes: ', $event.target.value);
  }
  onCommuneChange($event: any) {
    this.villages = _.get(_.find(this.communes,{id:Number($event.target.value)}),'villages',[]);
  }
  onVillageChange($event: any){
    console.log('village: ', $event);
  }
  onQuestionSelect($event: any) {
    const question = _.find(this.questions, {id: Number($event.target.value)});
    const index = _.findIndex(this.questions, {id: Number($event.target.value)});
    this.questions[index] = Object.assign(question, {disabled: true});
  }
  findQuestions() {
    this.apicall.get('/security/questions').subscribe({
      next: (result) => { 
        this.questions = (result as Array<any>);
        this.isQuestionSelected(Number(this.templateForm.security.question1));
        this.isQuestionSelected(Number(this.templateForm.security.question2));
        this.isQuestionSelected(Number(this.templateForm.security.question3));   
      }
    });
  }
  isQuestionSelected(questionId: number) {
    const question = _.find(this.questions, {id: questionId});
    if(_.isObject(question)) {
      const index = _.findIndex(this.questions, {id: questionId});
      this.questions[index] = Object.assign(question, {disabled: true});
    }
  }
}