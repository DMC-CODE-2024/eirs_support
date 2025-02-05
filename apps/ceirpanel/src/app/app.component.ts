/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  ClarityIcons,
  angleIcon,
  bellIcon,
  cogIcon,
  dashboardIcon,
  detailCollapseIcon,
  detailExpandIcon,
  devicesIcon,
  downloadIcon,
  ellipsisVerticalIcon,
  employeeGroupIcon,
  eyeIcon,
  fileIcon,
  filter2Icon,
  folderIcon,
  folderOpenIcon,
  formIcon,
  historyIcon,
  homeIcon,
  hostGroupIcon,
  libraryIcon,
  lineChartIcon,
  listIcon,
  lockIcon,
  noAccessIcon,
  nodeGroupIcon,
  paperclipIcon,
  pencilIcon,
  plusIcon,
  refreshIcon,
  sunIcon,
  tagIcon,
  tagsIcon,
  trashIcon,
  userIcon,
  usersIcon,
  viewListIcon,
  worldIcon,
  arrowIcon
} from '@cds/core/icon';
import '@cds/core/icon/register.js';
import * as _ from 'lodash';
import { ConfigService } from 'ng-config-service';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { Subscription, interval } from 'rxjs';
import { AppAlertComponent } from './ceir-common/app.alert.component';
import { ApiUtilService } from './core/services/common/api.util.service';
import { AuthService } from './core/services/common/auth.service';
import { MenuTransportService } from './core/services/common/menu.transport.service';
import { PermissionService } from './core/services/common/permission.service';
import { DOCUMENT } from '@angular/common';
import { JwtService } from './core/services/common/jwt.service';
import { UserModel } from './core/models/user.model';
import { UUID } from 'angular2-uuid';
import { TranslateService } from '@ngx-translate/core';

ClarityIcons.addIcons(
  userIcon,
  angleIcon,
  cogIcon,
  viewListIcon,
  devicesIcon,
  filter2Icon,
  plusIcon,
  listIcon,
  pencilIcon,
  historyIcon,
  trashIcon,
  refreshIcon,
  dashboardIcon,
  detailCollapseIcon,
  worldIcon,
  bellIcon,
  lineChartIcon,
  detailExpandIcon,
  formIcon,
  libraryIcon,
  employeeGroupIcon,
  hostGroupIcon,
  nodeGroupIcon,
  tagIcon,
  tagsIcon,
  noAccessIcon,
  usersIcon,
  sunIcon,
  homeIcon,
  ellipsisVerticalIcon,
  downloadIcon,
  eyeIcon,
  paperclipIcon,
  folderIcon,
  fileIcon,
  folderOpenIcon,
  lockIcon,
  arrowIcon
);
@Component({
  standalone: false,
  selector: 'ceirpanel-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [],
})
export class AppComponent implements OnInit, OnDestroy {
  iscollapse = false;
  menu!: any;
  @ViewChild('sidebar', { read: ElementRef }) sidebar!: ElementRef;
  title = '';
  isAuthenticated = false;
  sub: Subscription = new Subscription();
  @ViewChild(AppAlertComponent) alert!: AppAlertComponent;
  url = '';
  brandName = 'EIRS';
  header = 'yes';
  copyright = {currentYear:'', company:''};
  hidesidebar = 'no';
  token!: string;
  inIframe = false;

  constructor(
    public menuTransport: MenuTransportService,
    private apiutil: ApiUtilService,
    public authService: AuthService,
    public permission: NgxPermissionsService,
    public roleService: NgxRolesService,
    private permissionService: PermissionService,
    private router: Router,
    public config: ConfigService,
    private route: ActivatedRoute,
    private titleService:Title,
    private jwtService: JwtService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.translate.use(localStorage.getItem(`${window.name}lang`) || 'us');
    this.inIframe = this.jwtService.getIframeLogin().inIframe;
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        
        this.brandName = this.config.get('brandName') || 'CEIR';
        this.titleService.setTitle(`${this.config.get('brandName')} Public Support Portal`);

        this.apiutil.get('/user/getUserType').subscribe({
          next: (data: any) => {
            //console.log('data: ', data);
            if (_.isEqual(_.get(data, 'userType'), 'END_USER')) {
              this.titleService.setTitle(`${this.config.get('brandName')} Public Support Portal`);
              this.title = `${this.config.get('brandName')}<br>Public Support Portal`;
              //console.log('title: ', this.title);
            } else if (_.isEqual(_.get(data, 'userType'), 'customer-care')) {
              this.titleService.setTitle(`${this.config.get('brandName')} Customer Care Portal`);
              this.title = `${this.config.get('brandName')}<br>Customer Care Portal`;
            } else if (_.isEqual(_.get(data, 'userType'), 'ticket-support')) {
              this.titleService.setTitle(`${this.config.get('brandName')} System Admin`);
              this.title = `${this.config.get('brandName')}<br>System Admin`;
            } else {
              this.titleService.setTitle(`${this.config.get('brandName')} User Management`);
              this.title = `${this.config.get('brandName')}<br>User Management`;
              //console.log('title: ', this.title);
            }
          }, 
        });
        this.url = val.url;
        this.inIframe = this.jwtService.getIframeLogin().inIframe;
      }
    });
    this.authService.isAuthenticated.subscribe(
      (isAuthenticated) => (this.isAuthenticated = isAuthenticated)
    );
    this.menuTransport._menu.subscribe((menu: any) => {
      if (Object.keys(menu).length) {
        this.menu = _.sortBy(menu, ['displayOrder']);
      }
    });
    this.menuTransport._alert.subscribe((alert: any) => {
      if (Object.keys(alert).length) {
        //console.log('alert: ', alert);
        this.alert.put(alert);
      }
    });
    
  }
  initialize() {
    try {
      this.apiutil.get('/api/auth/isLogin').subscribe({
        next: (data:any) => {
          if(!_.isEmpty(this.token)) {
            data.token = this.token;
            this.authService.setAuth(data as UserModel, this.token);
          }
          if (_.isEqual(_.get(data, 'login'), true)) {
            this.permissionService.loadPermissions();
            if (_.isEqual(_.get(data, 'passwordExpire'), true)) {
              this.router.navigate(['/change-password']);
            }
            this.menuTransport.loader = false;
            this.permissionService.load();
            this.apiutil.loadMenu('vivesha').subscribe({
              next: (menu) => {
                this.menuTransport.menu = menu;
                this.menuTransport.loader = true;
              },
            });
          } else {
            this.authService.purgeAuth('logout');
            localStorage.removeItem(`${this.jwtService.getWindow()}permissions`);
          }
        }
      });
    } catch (e) {
      console.log('error: ', e);
    }
  }
  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const href = window.location.href;
    const uri = href.split('/')[4];
    const arr = href.split('?');
    const params = arr.length > 1 ? arr[1]: '';
    this.token = urlParams.get('token') || '';
    this.hidesidebar = urlParams.get('hidesidebar') || 'no';
    this.header = urlParams.get('header') || 'yes';
    
    if(_.isEmpty(this.token)) {
      const iframelogin: any = this.jwtService.getIframeLogin();
      if (!_.isEmpty(iframelogin) && !_.isEmpty(iframelogin.token)) {
        this.inIframe = true;
      } else {
        this.initialize();
        this.inIframe = false;
      }
    } else {
      this.authService.purgeAuth('logout');
      localStorage.removeItem(`${this.jwtService.getWindow()}permissions`);
      this.jwtService.removeIFrameLogin();
      this.inIframe = true;
      this.header = 'no';
      this.hidesidebar = 'yes';
      this.jwtService.setIframeLogin({
        uri: uri.substring(0, uri.indexOf('?')),
        lang: urlParams.get('lang') || 'us',
        token: urlParams.get('token') || '',
        header: this.header,
        type: urlParams.get('type') || 0,
        inIframe: _.isEmpty(this.token) ? false : true,
        hidesidebar: this.hidesidebar,
      });
      this.jwtService.setToken(this.token);
      this.apiutil.get('/api/auth/isLogin').subscribe({
        next: (data: any) => {
          this.authService.setAuth(data as UserModel, this.token);
          this.permissionService.load().then(() => console.log());
        }
      });
    }
    this.copyright = {
      currentYear: '' + new Date().getFullYear(),
      company: this.config.get('company') || 'Macra',
    };
  }

  init(collapse: boolean) {
    this.iscollapse = collapse;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
