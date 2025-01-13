/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { ConfigService } from 'ng-config-service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { Subscription } from 'rxjs';
import { ApiUtilService } from '../core/services/common/api.util.service';
import { MenuTransportService } from '../core/services/common/menu.transport.service';
import { UploadService } from '../core/services/common/upload.service';
import * as _ from 'lodash'; 
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ceirpanel-tree-sidebar',
  template: `
  <section class="sidenav-content tcw mb1 border border-0" (resized)="onResized($event)">
    <!--div class="clr-row bg1 profile mb1 pb0 mt0 pt0 ">
        <div class="clr-col-12 tcw mt1">
            <div class="clr-row">
                <div class="clr-col-3 profile-container">
                    <img [src]="profileImg" alt="">
                    <div class="centered uppercase">
                        V K
                    </div>
                </div>
                <div class="clr-col-9 text-left">
                    <p class="tcw ell">Vivek Kumar</p>
                    <p class="tcw username ell">kuarssvivek@gmail.com</p>
                    <p class="tcw edit ell">
                        <a href="JavaScript:void(0)" class="tcw">
                            <clr-icon shape="pencil" size="8"></clr-icon> View/Edit Profile 
                        </a>
                    </p>
                </div>
            </div>
            <div class="clr-row clr-justify-content-center ell">
                <div class="clr-col-8 profile-sub text-center">Admin</div>
            </div>
        </div>
    </div--> 
    <section class="nav-group m-0 p-0 tcw p3 mb-5 border border-0">
        <clr-tree class="border border-0" *ngIf="menu">
            <clr-tree-node [clrExpanded]="i === 0 ? true : false" *ngFor="let p of menu | sortByOrder; let i = index" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">
                <!--ng-template [ngxPermissionsOnly]="[p.tag]"-->
                  <div *ngIf="p.link; then link else icon"></div>
                  <ng-template #link>
                    <a [routerLink]="[p.link]" [queryParams]="{w: windowname}" class="clr-treenode-link text-truncate" style="text-decoration: none;width: 95%;">
                      <div *ngIf="p.url; then img else nimg"></div>
                      <ng-template #img>
                        <img [src]="p.url" alt="" class="img-fluid" style="height:30px;width:30px;">
                        <span class="px-2">{{p?.name}}</span>
                      </ng-template>
                      <ng-template #nimg><cds-icon *ngIf="!p.icon.includes('feature')" [attr.shape]="p?.icon" shape="user" size="30"></cds-icon>{{p?.name}}</ng-template>
                    </a>
                  </ng-template>
                  <ng-template #icon><cds-icon [attr.shape]="p?.icon" size="18"></cds-icon>{{ p?.name }}</ng-template>
                  <clr-tree-node *ngFor="let c of p.child">
                      <a [routerLink]="[c.link]" [queryParams]="{w: windowname}" class="clr-treenode-link btn text-capitalize text-truncate" style="width: 95%;">
                        <cds-icon [attr.shape]="c?.icon" class="is-solid text-white" size="18" style="height:30px;width:30px;"></cds-icon>{{ c?.name }}
                      </a>
                  </clr-tree-node>
                <!--/ng-template-->
            </clr-tree-node>
        </clr-tree>
    </section>
    <section class="nav-group ma0 pa0 tcw mb0 fixed pin-bottom border border-0" *ngIf="deviceService.isDesktop()" [ngStyle]="{'width': sidebarWidth + 'px', 'bottom':'-4px'}">
      <p class="sidear-footer text-break" *ngIf="deviceService.isDesktop()" [ngStyle]="{'width': sidebarWidth + 'px'}">
        {{ "copyright" | translate:copyright }}
      </p>
      <!--clr-tree class="ma0 pa0">
        <clr-tree-node class="ma0 pa0 bg1" >
            <a href="Javascript:void(0)" class="btn clr-treenode-link text-right mx-2" (click)="parentFun.emit(true)">
                <cds-icon shape="detail-collapse" dir="left" size="24"></cds-icon> {{ "button.footer"| translate }}
            </a>
        </clr-tree-node>
      </clr-tree-->
    </section>
</section>
  `,
  styles: [`
  .sidear-footer {
    position: fixed;
    bottom: 0;
    text-align: center;
    width: 300px;
    padding: 10px;
    color: #1e4076;
    background-color: #dde7f9;
}
  .profile {
  background-color: #3467c6;
  padding: 10px;
  border-bottom-right-radius: 35px;
  border-bottom-left-radius: 35px;
}

.profile-container {
  position: relative;
  text-align: center;
  color: white;
}

.centered {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.profile-sub {
  background-color: #1043a3;
  border-top-right-radius: 35px;
  border-top-left-radius: 35px;
}

.profile img {
  border-radius: 52%;
  width: 68px;
  height: 38px;
}

.profile p {
  margin-top: -0.2rem;
}

.profile .username {
  font-size: 9px;
  margin-top: -0.5rem;  
}

.profile .edit {
  font-size: 9px;
  margin-top: -0.5rem;
}

.clr-treenode-link, .clr-treenode-link:visited {
  display: inline-block;
  width: 100%;
  margin: 0;
  padding: 0 0 0 .3rem;
  background: 0 0;
  border: 0;
  cursor: pointer;
  text-align: left;
  /*
  font-size: 15px !important;
  font-family: "Open Sans", sans-serif;
  line-height: 60px;*/
}
:host ::ng-deep .clr-treenode-content:hover, .clr-treenode-content:focus, .clr-treenode-content:visited, .clr-treenode-content:visited {
  background: #3568C6 !important;
  background: var(--clr-tree-link-hover-color, #3568C6) !important;
  text-decoration: none;
  color: #1043a3;
}
:host ::ng-deep .clr-tree-node-content-container:hover, .clr-tree-node-content-container:focus,
.clr-tree-node-content-container:visited, .clr-tree-node-content-container:visited {
    background: #3568C6!important;
    background: var(--clr-tree-link-hover-color, #3568C6)!important;
    text-decoration: none;
    color: #1043a3;
    border-left: 0px solid #3568C6;
}
:host ::ng-deep .clr-tree-node-content-container:visited, .clr-tree-node-content-container:visited,
.clr-tree-node-content-container:visited, .clr-tree-node-content-container:visited > .active{
    background: #3568C6!important;
    background: var(--clr-tree-link-hover-color, #3568C6)!important;
    text-decoration: none;
    color: #1043a3;
    border-left: 0px solid #3568C6;
}
/*
:host ::ng-deep .active {
  background: #3568C6!important;
    background: #ececec !important;
    text-decoration: none;
    color: #1043a3;
    border-left: 4px solid #3568C6 !important;
}*/
  `],
  standalone: false,
  providers: [DeviceDetectorService]
})
export class TreeSidebarComponent implements OnInit {
  @Input() public menu!: any;
  @Output() public parentFun: EventEmitter<any> = new EventEmitter();
  profileImg: string | undefined;
  iscolapse = false;
  sidebarWidth: number | undefined;
  subscription!: Subscription;
  copyright = {currentYear:'', company:''};
  hidesidebar = 'no';
  windowname = window.name;
  constructor(
    private apiutil: ApiUtilService, private config: ConfigService,
    public menuTransport: MenuTransportService,
    public deviceService: DeviceDetectorService,
    public permission: NgxPermissionsService,
    private roleService: NgxRolesService,
    public uploadService: UploadService,
    public domSanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((queryParams) => {
      this.hidesidebar = queryParams['hidesidebar'] || 'no';
    });
    
  }
  ngOnInit(): void {
    this.profileImg = this.config.get('profileImg');
    this.copyright = {
      currentYear: '' + new Date().getFullYear(),
      company: this.config.get('company') || 'Macra',
    };
    
  }
  onResized(event: ResizedEvent) {
    this.sidebarWidth = event.newRect.width;
  }
  permissionAuth(role: string) {
    return false;
  }
  getSVGImageUrl(image:string) {
    const base64string = window.btoa(image);
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      `data:image/svg+xml;base64,${base64string}`
    );
  }
}
