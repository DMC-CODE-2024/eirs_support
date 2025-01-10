/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../core/services/common/auth.service';
import { MenuTransportService } from '../core/services/common/menu.transport.service';
import { ApiUtilService } from '../core/services/common/api.util.service';
import * as _ from 'lodash';
import { JwtService } from '../core/services/common/jwt.service';
import { ConfigService } from 'ng-config-service';
import { DOCUMENT, Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'ceirpanel-ceir-header',
  templateUrl: './ceir-header.component.html',
  styles: [
    `
      header .settings > .dropdown > .dropdown-toggle,
      header .header-actions > .dropdown > .dropdown-toggle,
      .header .settings > .dropdown > .dropdown-toggle,
      .header .header-actions > .dropdown > .dropdown-toggle {
        opacity: none !important;
        opacity: var(--clr-header-nav-opacity, none);
      }
      .progress,
      .progress-static {
        background-color: transparent;
        border-radius: 0;
        font-size: inherit;
        height: 1em;
        margin: 0;
        max-height: 0.1rem !important;
        min-height: 0.2rem;
        overflow: hidden;
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class CeirHeaderComponent implements OnInit{
  @Input() title = 'ceirpanel';
  siteLanguage = 'English';
  localeCode = 'us';
  languageList = [
    { code: 'us', label: 'English' },
    { code: 'km', label: 'Deutsch' },
  ];
  titleParam = { company: '' };
  isAuthenticated = false;
  progress = false;
  passwordprompt = false;
  paswordpromptdays:any = {};
  usermanulaurl = '/resource/usermanual';
  type = 0;
  logo = 'assets/images/logo.png';
  header = 'yes';
  lang = 'us';
  url = '/user';
  headertitle = this.title
  private style?: HTMLLinkElement;
  languages:Array<any> = [];
  language = {name:'',image:'',code:''};
  currenturl = '';
  constructor(
    private translate: TranslateService,
    public authService: AuthService,
    public router: Router,
    private transport: MenuTransportService,
    private apiutil: ApiUtilService,
    public jwtService: JwtService,
    public config: ConfigService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private readonly location: Location,
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2,
    private titleService:Title
  ) {
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        this.titleService.setTitle(`${this.config.get('brandName')} Public Support Portal`);
        this.apiutil.get('/user/getUserType').subscribe({
          next: (data: any) => {
            if (_.isEqual(_.get(data, 'userType'), 'END_USER')) {
              this.translate.get('publicSupportTitle').subscribe((t) => {
                this.titleService.setTitle(`${this.config.get('brandName')} ${t}`);
                this.title = `${this.config.get('brandName')}<br>${t}`;
              });
            } else if (_.isEqual(_.get(data, 'userType'), 'customer-care')) {
              this.translate.get('customerCareTitle').subscribe((t) => {
                this.titleService.setTitle(`${this.config.get('brandName')} ${t}`);
                this.title = `${this.config.get('brandName')}<br>${t}`;
              });
            } else if (_.isEqual(_.get(data, 'userType'), 'ticket-support')) {
              this.translate.get('systemAdminTitle').subscribe((t) => {
                this.titleService.setTitle(`${this.config.get('brandName')} ${t}`);
                this.title = `${this.config.get('brandName')}<br>${t}`;
              });
            } else {
              this.translate.get('userManagementTitle').subscribe((t) => {
                this.titleService.setTitle(`${this.config.get('brandName')} ${t}`);
                this.title = `${this.config.get('brandName')}<br>${t}`;
              });
            }
          },
        });
        this.url = val.url;
        this.currenturl = this.router.url.split('?')[0];
        console.log('url changed: ', this.url);
      }
    });
    this.logo = this.config.get('logo') || 'assets/images/logo.png';
    this.usermanulaurl = `${this.config.get('api')}${this.usermanulaurl}`;
    this.apiutil.get('/user/isAlertForPasswordExpire').subscribe({
      next: (data) => {
        //console.log('data: ', data);
        this.passwordprompt = _.get(data as any, 'allow');
        this.paswordpromptdays = {paswordpromptdays:_.get(data as any, 'days')};
      },
    });
    this.authService.isAuthenticated.subscribe(
      (isAuthenticated) => (this.isAuthenticated = isAuthenticated)
    );
    this.transport._progress.subscribe((progress) => {
      this.progress = progress;
    });
    const iframelogin =  this.jwtService.getIframeLogin();
    this.route.queryParams.subscribe((queryParams) => {
      this.lang = queryParams['lang'] || _.isEmpty(iframelogin) || _.isUndefined(iframelogin.lang) ? queryParams['lang'] || 'us': iframelogin.lang;
      this.type = queryParams['type'] || _.isEmpty(iframelogin) || _.isUndefined(iframelogin.type) ? queryParams['type'] || 0: iframelogin.type;
      this.header = queryParams['header'] || _.isEmpty(iframelogin) || _.isUndefined(iframelogin.header) ? queryParams['header'] || 'yes': iframelogin.header;
      this.changeSiteLanguage(this.lang);
      this.removestyle();
      this.addstyle();
      this.setTitle();
    });
  }
  ngOnInit(): void {
    
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        this.setTitle();
      }
    });
    this.languages = this.config.get('languages') || [];
    //console.log('languages: ', this.languages);
    this.updateLanguage();
    this.currenturl = this.router.url.split('?')[0];
    //console.log('current url: ',this.router.url.split('?')[0]); 
  }
  setTitle() {
    if (_.isEqual(this.header, 'no')) {
      const key = _.some(['register-ticket-success'], (el) =>
        _.includes(this.router.url, el)
      )
        ? 'ticket.pageTitle.success'
        : _.some(['view-ticket'], (el) => _.includes(this.router.url, el)) || _.some(['ticket-thread'], (el) => _.includes(this.router.url, el))
        ? 'ticket.viewTicket.title'
        : _.some(['forgot-ticket'], (el) => _.includes(this.router.url, el))
        ? 'ticket.forgotTicket.title'
        : _.some(['register-ticket'], (el) =>
            _.includes(this.router.url, el)
          )
        ? 'ticket.pageTitle.add' : 'ticket.pageTitle.add';
      //console.log('key: ',key);
      this.translate.get(key).subscribe((t) => {
        this.headertitle = t;
        console.log('title:- ', t);
      });
    }
  }
  changeSiteLanguage(localeCode: string): void {
    console.log('locale: ', localeCode);
    this.localeCode = localeCode;
    const selectedLanguage = this.languageList
      .find((language) => language.code === localeCode)
      ?.label.toString();
    if (selectedLanguage) {
      this.siteLanguage = selectedLanguage;
      this.translate.use(localeCode);
    }
    const currentLanguage = this.translate.currentLang;
    console.log('currentLanguage', currentLanguage);
    this.updateLanguage();
    
  }
  updateLanguage(){
    this.languages.forEach(l => {
      if (_.isEqual(_.get(l, 'code'), this.lang)) {
        this.language = l;
      }
    });
  }
  logout() {
    this.apiutil.get('/api/auth/logout').subscribe({
      complete: () => {
        this.authService.purgeAuth('logout');
        localStorage.removeItem('permissions');
        this.router.navigate(['/']);
      },
    });
  }
  download() {
    this.apiutil.get('/resource/usermanual').subscribe({
      next: (file: any) => {
        const a = document.createElement('a');
        a.setAttribute('type', 'hidden');
        a.href = URL.createObjectURL(file.data);
        a.download = 'usermanual' + '.xlsx';
        a.click();
        a.remove();
      },
    });
  }
  addstyle() {
    const cssPath = `assets/css/${this.lang}.css`;
    this.style = this.renderer2.createElement('link') as HTMLLinkElement;
    this.renderer2.appendChild(this.document.head, this.style);
    this.renderer2.setProperty(this.style, 'rel', 'stylesheet');
    this.renderer2.setProperty(this.style, 'href', cssPath);
  }
  removestyle() {
    if (_.isEmpty(this.style) == false)
      this.renderer2.removeChild(this.document.head, this.style);
  }
}
