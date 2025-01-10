/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrForm, ClrStepButton, ClrStepper } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { PageType } from '../../core/constants/page.type';
import { AclCreateModel, AclModel } from '../../core/models/acl.model';
import { FeatureModuleModel } from '../../core/models/feature-module.model';
import { RoleModel } from '../../core/models/role.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { MenuTransportService } from '../../core/services/common/menu.transport.service';
import { DualBoxService } from '../services/dual.box.service';

@Component({
  selector: 'ceirpanel-acl-add',
  templateUrl: '../html/acl-add.component.html',
  styles: [`
  :host ::ng-deep .clr-combobox-wrapper {
    min-width: 95% !important;
  }
  `],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AclAddComponent implements OnInit {
  public page: string = '' as string;
  public path: string = '' as string;
  public id: number = 0 as number;
  readonly = false;
  public modules: Array<any> = [];
  selected: RoleModel[] = [];
  @ViewChild(ClrStepButton, { static: false }) submitButton!: ClrStepButton;
  @ViewChild(ClrStepper, { static: false }) clrStepper!: ClrStepper;
  templateForm: object = { parentGroup: '' } as object;
  @ViewChild(ClrForm, { static: true }) private clrForm!: ClrForm;
  acl: AclCreateModel = {role:{id: 0}} as AclCreateModel;
  source!: Array<any>;
  confirmed: Array<any> = [];
  key = 'id';
  display = 'name';
  roles: Array<RoleModel> = [];
  public cancel = false;
  public trees: any;

  constructor(
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private apicall: ApiUtilService,
    private transport: MenuTransportService,
    private router: Router,
    private dualbox: DualBoxService) { }

  ngOnInit(): void {
    this.path = this.route.snapshot.url[0].path;
    this.page = this.route.snapshot.paramMap.get('page') || '';
    this.id = Number(this.route.snapshot.queryParamMap.get('roleId') || 0);
    if (this.page === PageType.view) { this.readonly = true; }
    this.findRoles();
    if (this.id > 0) {
      this.acl.role.id = this.id;
      this.fetchData();
    } else {
      this.findFeatures({ features: [] as Array<any> } as AclModel,0);
    }
    this.cdref.detectChanges();
  }
  fetchData() {
    this.apicall.get(`/acl/findTreeByRoleId/${this.id}`).subscribe({
      next: (data) => {
        this.trees = data;
      },
      error: (e) => console.log(e),
      complete: () => console.info('complete')
    });
  }
  onChangeInput(event: any){
    console.log('event: ', event);
  }
  onSubmit(userForm: NgForm) {
    if (userForm.invalid) { this.clrForm.markAsTouched(); return; }
    this.save();
  }
  save() {
    this.transport.progress = true;
    const observable: Observable<unknown> = this.apicall.post(`/acl/save`, this.trees);
    observable.subscribe({
      next: (_data) => {
        console.log('role save: ', (_data as RoleModel).id);
        return this.router.navigate(['/acl']);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        setTimeout(() => this.transport.progress = false, 3000);
      }
    });
  }
  findRoles() {
    this.apicall.get('/role/list').subscribe({
      next: (result) => {
        this.roles = (result as RoleModel[]);
      },
      error: (e) => {
        console.log('error', e);
      },
      complete: () => {
        console.log('error');
      }
    });
  }
  findFeatures(aclModel: AclModel, roleId: number | 0) {
    const url = roleId > 0 ? `/feature/list/${roleId}`: '/feature/all/list';
    this.apicall.get(url).subscribe({
      next: (result) => {
        this.modules = result as FeatureModuleModel[];
        this.trees = this.dualbox.getDualList(result as FeatureModuleModel[], aclModel);
        console.log('trees: ', this.trees);
      },
      error: (e) => {
        console.log('error', e);
      },
      complete: () => {
        console.log('error');
      }
    });
  }
  displayStr(item: any = null) {
    console.log('item: {}', item);
  }
  cancelOpenClose(cancel: boolean) {
    this.cancel = false;
    if (cancel == true) this.router.navigate([this.path]);
  }
  public changeSelected(data: any): void {
    this.trees.forEach((tree: { selected: any; }) => tree.selected = data);
  }
  public changeSelectedAsset(asset: any, data: any): void {
    console.log('data: ', data);
    //asset.selected = data;
  }
  public onParent(event: any) {
    this.trees.childs.forEach((c: { selected: any, childs: any }) => {
      c.selected = event.target.checked;
      c.childs.forEach((m: { selected: any; }) => m.selected = event.target.checked);
    });
  }
  public onChild(event: any, tree: any, modules: any[]){
    tree.selected = event.target.checked;
    modules.filter(m => !m.disabled).map(m => m.selected = event.target.checked);
  }
  onRoleChange($event: any) {
    this.id = $event.target.value;
    if (this.id > 0) {
      this.apicall.get(`/acl/findTreeByRoleId/${this.id}`).subscribe({
        next: (data) => {
          this.trees = data;
        },
        error: (e) => console.log(e),
        complete: () => console.info('complete')
      });
    }
  }
}
