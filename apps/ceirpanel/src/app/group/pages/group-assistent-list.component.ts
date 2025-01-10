/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, of, switchMap } from 'rxjs';
import { GroupModel } from '../../core/models/group.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import * as _ from "lodash";

@Component({
  selector: 'ceirpanel-group-assistent-list',
  template: `
    <div class="card" style="min-height: 85vh;">
      <div class="card-header">
        <div class="clr-row clr-justify-content-between">
          <div class="clr-col-4" style="margin-top: 5px;">
            <h4 class="card-title">{{ 'group.pageTitle.list' | translate }}</h4>
          </div>
          <div class="clr-col-6 m-0 p-0">
            <div class="btn-group btn-primary float-end">
              <ng-template
                [ngxPermissionsOnly]="['GROUP_ADD']"
                [ngxPermissionsOnlyThen]="showAdd"
                [ngxPermissionsOnlyElse]="hideAdd"
              ></ng-template>
              <ng-template #showAdd>
                <button
                  class="btn"
                  aria-label="Check"
                  [routerLink]="['add']"
                >
                  <cds-icon shape="plus" solid="true" inverse="true"></cds-icon>
                  {{ 'group.pageTitle.add' | translate }}
                </button>
              </ng-template>
              <ng-template #hideAdd>
                <button
                  class="btn"
                  aria-label="Check"
                  [routerLink]="['add']"
                  disabled
                >
                  <cds-icon shape="plus" solid="true" inverse="true"></cds-icon>
                  {{ 'group.pageTitle.add' | translate }}
                </button>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
      <div class="card-block m-0 p-0">
        <div class="content-container">
          <clr-vertical-nav style="min-height: 77vh;">
            <clr-tree *ngIf="groups && groups.length > 0">
              <clr-tree-node
                *clrRecursiveFor="let group of groups; getChildren: getChildren"
                [clrExpanded]="true"
                class="m-0 p-0"
              >
                <a
                  class="btn"
                  [routerLink]="[childurl !== undefined ? childurl: 'user-group-advanced', group.id]"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: false }"
                  (click)="onSelect(group.id)"
                  class="clr-treenode-link text-truncate"
                  style="text-decoration: none;width: 95%;"
                >
                  <cds-icon
                    [attr.shape]="group.children.length > 0 ? 'folder-open' : 'file'"
                   solid="true" status="warning" badge="danger"></cds-icon>
                  {{ group?.groupName }}
                </a>
              </clr-tree-node>
            </clr-tree>
          </clr-vertical-nav>
          <div class="content-area">
            <nav class="subnav">
              <ul class="nav m-0 p-0">
                <li class="nav-item">
                  <a
                    class="nav-link"
                    [routerLink]="['user-group-advanced', groupId]"
                    routerLinkActive="linkactive"
                    >User Group Management</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    [routerLink]="['group-feature-advanced', groupId]"
                    routerLinkActive="linkactive"
                    >Group Feature Management</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    [routerLink]="['group-role-advanced', groupId]"
                    routerLinkActive="linkactive"
                    >Group Role Management</a
                  >
                </li>
              </ul>
            </nav>
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dropdown-toggle::after {
        display: none;
      }
      .nav .nav-link.linkactive {
        color: #000;
        color: var(--clr-nav-link-active-color, hsl(198, 0%, 0%));
        font-weight: 400;
        font-weight: var(--clr-nav-link-active-font-weight, 400);
      }
      .nav .nav-link:hover,
      .nav .nav-link:focus,
      .nav .nav-link:active,
      .nav .nav-link.linkactive {
        text-decoration: none;
      }
      .nav .nav-link:hover,
      .nav .nav-link.linkactive {
        box-shadow: 0 -0.15rem 0 #0072a3 inset;
        box-shadow: 0 -0.15rem 0 var(
            --clr-nav-active-box-shadow-color,
            hsl(198, 100%, 32%)
          ) inset;
        transition: box-shadow 0.2s ease-in;
      }
    `,
  ],
})
export class GroupAssistentListComponent implements OnInit {
  public groups!: GroupModel[];
  public total!: number;
  public loading = true;
  public selected: any[] = [];
  groupId!: number;
  childurl = 'user-group-advanced';

  constructor(private apicall: ApiUtilService, private route: ActivatedRoute, private router: Router) {
    
  }
  ngOnInit(): void {
    this.route?.firstChild?.url.subscribe(() => {
      this.childurl = _.split(this.router.url, '/')[2];
    });
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        switchMap(
          () =>
            (this.route.firstChild && this.route.firstChild.url) ||
            of([]),
        ),
      )
      .subscribe(params => {this.childurl = params[0]?.path} );
    this.groupId = this.route.firstChild?.snapshot.params['groupId'] || 0;
    this.groupList();
  }
  groupList() {
    this.apicall.get('/group/parents').subscribe({
      next: (result) => {
        this.groups = result as GroupModel[];
        if(this.groupId==0 && this.groups.length > 0) {
          this.groupId = this.groups[0].id;
          this.router.navigate(['/group/user-group-advanced',this.groups[0].id])
        }
      },
    });
  }
  getChildren = (group: { children: any }) => group.children;
  onSelect(groupId: number) {
    this.groupId = groupId;
  }
}
