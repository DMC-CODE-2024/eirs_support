/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from 'ng-config-service';
import { MenuTransportService } from '../core/services/common/menu.transport.service';
import { ApiUtilService } from '../core/services/common/api.util.service';

@Component({
    selector: 'ceirpanel-dropdown-sidebar',
    template: `
    <div *ngFor="let p of menu; let i = index" [id]="i">
    <div *ngIf="p.child && p.child.length > 0 then dropdown else button"></div>
    <ng-template #button>
        <button class="btn btn-link btn-block mb1 tcw"><cds-icon [attr.shape]="p?.icon" size="48" (mouseover)="openclose(p)" [routerLink]="[p.link]"></cds-icon></button>
    </ng-template>
    <ng-template #dropdown>
        <clr-dropdown [clrCloseMenuOnItemClick]="false" [id]="i">
            <button clrDropdownTrigger="false" aria-label="Dropdown demo button" class="btn btn-link btn-block mb1 tcw" (mouseover)="openclose(p)">
                <div *ngIf="p.link; then link else icon"></div>
                <ng-template #link>
                    <a [routerLink]="[p.link]" class="clr-treenode-link">
                        <cds-icon [attr.shape]="p?.icon" size="48"></cds-icon>
                    </a>
                </ng-template>
                <ng-template #icon>
                    <cds-icon [attr.shape]="p?.icon" size="48"></cds-icon>
                </ng-template>
            </button>
            <clr-dropdown-menu *clrIfOpen="p.open" clrPosition="right-top" class="bg8 ::tc1 @tc1">
                <a clrDropdownItem *ngFor="let c of p.child" class="tcw ::tc1 @tc1 :tc1">
                    <cds-icon [attr.shape]="c?.icon" class="is-solid" size="18"></cds-icon> {{c?.name}}
                </a>
            </clr-dropdown-menu>
        </clr-dropdown>
    </ng-template>
</div>
<section class="nav-group ma0 pa0 tcw mb0 fixed pin-bottom" style="max-width: 3.8rem;min-width: 3.8rem; width: 18%; bottom: -4px;">
    <clr-tree>
        <clr-tree-node class="ma0 pa0 bg1">
            <a href="Javascript:void(0)" class="clr-treenode-link" (click)="parentFun.emit(false)">
                <cds-icon shape="detail-expand" dir="right" size="24"></cds-icon>
            </a>
        </clr-tree-node>
    </clr-tree>
</section>
    `,
    styles: [``],
    standalone: false
})
export class DropdownSidebarComponent implements OnInit {
    @Input() public menu!: any;
    @Output() public parentFun: EventEmitter<any> = new EventEmitter();
    profileImg: string | undefined;
    iscolapse = false;
    sidebarWidth: number | undefined;
    constructor(
        private apiutil: ApiUtilService,
        private config: ConfigService,
        public menuTransport: MenuTransportService) { }
    ngOnInit(): void {
        this.profileImg = 'data:image/png;base64,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';
    }
    
    openclose(menu: any) {
        this.menu.forEach((m: any) => m.name === menu.name ? m.open = true : m.open = false);
    }
}
