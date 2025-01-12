/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm, ClrStepButton, ClrStepper } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, take } from 'rxjs';
import { PageType } from '../../core/constants/page.type';
import { FeatureModel } from '../../core/models/feature.model';
import { GroupFeatureCreateModel } from '../../core/models/group.feature.model';
import { GroupModel } from '../../core/models/group.model';
import { RoleModel } from '../../core/models/role.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { GroupFeatureService } from '../service/group.feature.service';
import { GroupFeatureDto } from '../dto/group.feature.dto';
import * as _ from "lodash";
import { DualListComponent } from '@ceirpanel/dual-listbox';
import {Location} from '@angular/common';

@Component({
  selector: 'ceirpanel-group-feature-add',
  templateUrl: '../html/group-feature-add.component.html',
  styles: [`
  :host ::ng-deep .clr-combobox-wrapper {
    min-width: 95% !important;
  }
  `],
})
export class GroupFeatureAddComponent implements OnInit {
  public path: string = '' as string;
  public page: string = '' as string;
  public id: number = 0 as number;
  readonly = false;
  public features!: FeatureModel[];
  selected: RoleModel [] = [];
  @ViewChild(ClrStepButton, { static: false }) submitButton!: ClrStepButton;
  @ViewChild(ClrStepper, { static: false }) clrStepper!: ClrStepper;
  templateForm: object = { parentGroup: '' } as object;
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
  groupFeature: GroupFeatureCreateModel = {group: {id: 0}} as GroupFeatureCreateModel;
  source!: Array<any>;
  confirmed: Array<any> = [];
  key = 'id';
  display = 'featureName';
  groups: Array<GroupModel> = [];
  public open = false;
  public cancel = false;
  public format = { add: 'Add', remove: 'Remove', all: 'All', none: 'None',
  direction: DualListComponent.LTR, draggable: true, locale: 'us' };

  constructor(
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private apicall: ApiUtilService,
    private transport: MenuTransportService,
    private groupFeatureService: GroupFeatureService,
    private router: Router,
    public _location: Location) { }

  ngOnInit(): void {
    this.path = this.route.snapshot.url[0].path;
    this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
    this.findFeatures();
    this.findGroups();
    if (this.id > 0) {
      this.groupFeatureService.findByGroupId(this.id).pipe(take(1)).subscribe((data: Array<GroupFeatureDto>) => {
        data = _.sortBy(data, ['displayOrder'], 'asc');
        this.groupFeature = {groupId: this.id, features: data.map(r => r.id.featureId), featuremap: [],group:{id:this.id} as GroupModel};
        data.forEach(d => this.confirmed.push({id: d.id.featureId, displayOrder: 'asc'}));
      });
    }
    this.route.url.subscribe(() => {
      const parent = this.route?.snapshot?.parent?.url[0]?.path;
      this.page = _.split(this.router.url,'/')[2];
      if (this.page === PageType.view) { this.readonly = true; }
     });
  }
  onSubmit(userForm: NgForm) {
    if (userForm.invalid) { this.clrForm.markAsTouched(); return; }
    this.save();
  }
  save() {
    this.transport.progress = true;
    this.confirmed = _.orderBy(this.confirmed, ['displayOrder'], ['asc']);
    this.groupFeature.featuremap = this.confirmed.map((s, index) => {
      return {featureId: s.id, displayOrder: index};
    });
    this.groupFeature.groupId = this.groupFeature.group.id;
    
    const observable: Observable<unknown> = this.page == PageType.edit ?
      this.apicall.put(`/groupFeature/update/${this.id}`, this.groupFeature) : this.apicall.post(`/groupFeature/save`, this.groupFeature);

    observable.subscribe({
      next: (_data) => {
        return this.router.navigate(['/group-feature']);
      },
      complete: () => {
        setTimeout(() => this.transport.progress = false, 3000);
      }
    });
  }
  findFeatures() {
    this.apicall.get('/feature/list').subscribe({
      next: (result) => {
        this.features = (result as FeatureModel[]);
        this.features = this.features.map(r => Object.assign(r, {index: 0}));
      }
    });
  }
  findGroups() {
    this.apicall.get('/group/list').subscribe({
      next: (result) => {
        this.groups = (result as GroupModel[]);
      }
    });
  }
  onGroupChange($event: any) {
    this.id = $event.target.value;
    this.groupFeatureService.findByGroupId(this.id).pipe(take(1)).subscribe((data: Array<GroupFeatureDto>) => {
      data = _.sortBy(data, ['displayOrder'], 'asc');
      this.confirmed = [];
      this.groupFeature = {groupId: this.id, features: data.map(r => r.id.featureId),featuremap:[],group:{id:this.id} as GroupModel};
      data.forEach(d => this.confirmed.push({id: d.id.featureId, displayOrder: 'asc'}));
    });
  }
  cancelOpenClose(cancel: boolean) {
    this.cancel = false;
    if(cancel == true)this.router.navigate([this.path]);
  }
}
