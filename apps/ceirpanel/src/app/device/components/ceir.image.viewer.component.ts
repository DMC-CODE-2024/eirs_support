/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgImageSliderComponent } from 'ng-image-slider';
import { Device } from '../../core/models/device.model';
import { DeviceService } from '../../core/services/device.service';
import { ConfigService } from 'ng-config-service';

@Component({
  selector: 'ceirpanel-image-viewer',
  template: `
    <input type="file" accept="image/*" #file style="display: none;" (change)="onFileSelect($event)">
      <button type="submit" class="btn btn-primary-outline btn-block mt-1" (click)="file.click()">
        <cds-icon shape="plus"></cds-icon> Upload Image
      </button>
      <p class="mt0 p5">Minimum file size 20 Mb</p>
      <div class="clr-row">
        <div class="clr-col-12">
          <a href="javascript:void(0)" class="card  mt0">
            <div class="card-img">
              <img [src]="imgToView" alt="assets/images/no-image-found-360x250.png" class="img-thumbnail" />
            </div>
            <div class="card-footer m-0 p-0">
              <div class="btn-group btn-primary btn-icon">
                <button type="button" class="btn btn-icon btn-sm btn-danger" (click)="removeImage()">
                  <cds-icon shape="trash"></cds-icon>
                </button>
                <button type="button" class="btn btn-icon btn-sm btn btn-icon btn-primary" (click)="file.click()">
                  <cds-icon shape="refresh"></cds-icon>
                </button>
              </div>
          </div>
          </a>
        </div>
      </div>
      <div class="clr-row mt1">
        <div class="clr-col-12">
          <ng-image-slider #nav *ngIf="load"
          [images]="imageObject"
          [autoSlide]="{interval: 2, stopOnHover: false}"
          [imageSize]="{width: 60, height: 60, space: 1}"
          [infinite]="sliderInfinite"
          [imagePopup]="sliderImagePopup"
          [showArrow]="sliderArrowShow"
          [autoSlide]="sliderAutoSlide ? 1 : 0"
          [slideImage]="+sliderSlideImage"
          [animationSpeed]="sliderAnimationSpeed"
          [manageImageRatio]="false"
          [videoAutoPlay]="true"
          [showVideoControls]="true"
          [paginationShow]="false"
          [orderType]="slideOrderType"
          (imageClick)="imageOnClick($event)"
          (arrowClick)="arrowOnClick($event)"
          (lightboxClose)="lightboxClose()"
          (lightboxArrowClick)="lightboxArrowClick($event)"></ng-image-slider>
        </div>
      </div>
    `,
  styles: [``],
  providers: []
})
export class CeirImageViewerComponent implements OnInit {
  @Input() device: Device = {} as Device;
  @ViewChild('nav', { static: false }) ds!: NgImageSliderComponent;
  showSlider = true;
  sliderWidth = 240;
  sliderImageWidth = 120;
  sliderImageHeight = 100;
  sliderArrowShow = true;
  sliderInfinite = false;
  sliderImagePopup = false;
  sliderAutoSlide = false;
  sliderSlideImage = 1;
  sliderAnimationSpeed = 1;
  slideOrderType = 'DESC';
  imageObject: Array<any> = [] as Array<any>;
  existingImageObject: Array<any> = [] as Array<any>;
  imgToView: any = 'assets/images/no-image-found-360x250.png';
  url = '';
  clickedImgIndex = 0;
  load = true;

  constructor(private deviceService: DeviceService, private config: ConfigService) { }

  ngOnInit(): void {
    const deviceImages = Number(this.config.get('deviceImages'));
    if (!this.device.attachedFiles) this.device.attachedFiles = [];
    for (let i = 0; i < this.device.attachedFiles.length; i++) {
      this.existingImageObject.push({ image: this.imgToView, thumbImage: this.imgToView, id: this.device.attachedFiles[i].id });
    }
    this.clickedImgIndex = this.device.attachedFiles.length;
    for (let i = this.device.attachedFiles.length; i < deviceImages; i++) {
      this.imageObject.push({ image: this.imgToView, thumbImage: this.imgToView });
    }
    this.load = true;
  }
  onFileSelect(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.load = false;
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.imageObject[this.clickedImgIndex].image = this.url;
        this.imageObject[this.clickedImgIndex].thumbImage = this.url;
        this.imgToView = this.imageObject[this.clickedImgIndex].thumbImage;
        this.load = true;
      }
    }
  }
  removeImage() {
    this.load = false;
    setTimeout(() => {
      this.imageObject[this.clickedImgIndex].image = 'assets/images/no-image-found-360x250.png';
      this.imageObject[this.clickedImgIndex].thumbImage = 'assets/images/no-image-found-360x250.png';
      this.imgToView = 'assets/images/no-image-found-360x250.png';
      this.load = true;
    }, 100)
  }
  onChangeHandler() {
    this.showSlider = false;
    setTimeout(() => {
      this.showSlider = true;
    }, 10);
  }
  doubleTap() {
    
  }
  imageOnClick(index: any) {
    this.clickedImgIndex = index;
    this.imgToView = this.imageObject[index].thumbImage;
  }

  lightboxClose() {
    
  }

  arrowOnClick(event: any) {
    
  }

  lightboxArrowClick(event: any) {
    
  }

  prevImageClick() {
    this.ds.prev();
  }

  nextImageClick() {
    this.ds.next();
  }
}