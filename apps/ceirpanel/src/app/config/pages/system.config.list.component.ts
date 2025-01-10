import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'ceirpanel-system-config-list',
  template: `
    <iframe  
    #frame
    [src]="url" 
    [style.width.px]="containerWidth" 
    [style.height.px]="containerHeight" 
    height="100%" 
    width="100%"
    frameborder="0" 
    marginheight="0"
    marginwidth="0"></iframe>
  `,
  styles: [
    `
      :host ::ng-deep .clr-combobox-wrapper {
        min-width: 95% !important;
      }
      iframe { margin-bottom: -4px; }
      :host ::ng-deep .content-area ::-webkit-scrollbar { display: none !important; }
      :host ::ng-deep html, body {
    max-width: 100%;
    overflow-x: hidden !important;
}
#visibilityContainer :host ::ng-deep ::-webkit-scrollbar-thumb {
  display: none !important;
}
    `,
  ],
})
export class SystemConfigListComponent implements OnInit {

  url!: SafeResourceUrl;
  @ViewChild('frame') frameElement!: ElementRef;
  containerMinWidth = 0;
  containerMinHeight = 0;
  containerWidth: number = this.containerMinWidth;
  containerHeight: number = this.containerMinHeight;
  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
      '/mdrdemo/deviceManagement?featureId=55&userId=1367&userTypeId=25&userType=Device+Repository'
    );
    this.onResize(window.innerWidth, window.innerHeight);
  }
  @HostListener('window:resize', [
    '$event.target.innerWidth',
    '$event.target.innerHeight',
  ])
  onResize(width: number, height: number): void {
    console.log('width: ', width, ' height: ', height);
    const top = this.frameElement?.nativeElement?.offsetTop;
    const left = this.frameElement?.nativeElement?.offsetLeft;
    console.log('top: ', top, ' left: ', left);
    this.containerWidth = Math.max(width - left, this.containerMinWidth);
    this.containerHeight = Math.max(height - top, this.containerMinHeight);
  }
}
