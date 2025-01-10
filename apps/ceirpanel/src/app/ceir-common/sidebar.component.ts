/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { MenuTransportService } from '../core/services/common/menu.transport.service';

@Component({
  standalone: false,
  selector: 'ceirpanel-sidebar',
  providers: [MenuTransportService],
  template: `
  <ceirpanel-tree-sidebar *ngIf="!collapse" (parentFun)="parentFun($event)" [menu]="menu"></ceirpanel-tree-sidebar>
  <ceirpanel-dropdown-sidebar *ngIf="collapse" (parentFun)="parentFun($event)" [menu]="menu"></ceirpanel-dropdown-sidebar>
  `,
})
export class SidebarComponent {
  @Input() public menu!: any;
  @Output() public main: EventEmitter<any> = new EventEmitter();
  public collapse = false;
  constructor(public menuTransport: MenuTransportService) { }
  public parentFun($event: boolean){
    this.collapse = $event;
    this.main.emit($event);
  }
}
