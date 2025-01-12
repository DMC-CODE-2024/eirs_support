/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewChild } from '@angular/core';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import { FilterComponent } from './filter.component';
import * as _ from "lodash";
import { ConfigService } from 'ng-config-service';

@Component({
  selector: 'ceirpanel-extendable-list',
  template: ``,
  providers: [],
})
export class ExtendableListComponent {
  @ViewChild(FilterComponent) filterChild!: FilterComponent;
  public state!: ClrDatagridStateInterface;
  multiselect = false;
  public open = false;
  public selectedData: any[] = [];
  public selecton!: any;
  order = ClrDatagridSortOrder.DESC;
  orgFilter:any;

 

  changeView(event: any) {
    this.selecton = [];
    this.multiselect = event.target.checked;
    this.selecton = this.multiselect ? [] : null;
  }

  callFilter() {
    this.filterChild.onSubmit();
  }

  resetFilter() {
    this.orgFilter = {};
    this.filterChild.reset();
  }

  applyExisterFilter(){
    if(!_.isEmpty(this.orgFilter))this.applyFilter(this.orgFilter);
  }

  applyFilter(groupFilterModel: any) {
    this.orgFilter = groupFilterModel;
    const data: any[] = [];
    Object.keys(groupFilterModel).forEach((key, value) => {
      data.push({ property: key, value: groupFilterModel[key] });
    });
    this.state.filters = data;
  }
  pushFilter(filter: any){
    const filters: any[] = _.isArray(this.state.filters) && this.state.filters.length > 0 ?  this.state.filters as any []: [];
    Object.keys(filter).forEach((key, value) => {
      const index = _.findIndex(filters, {property: key});
      const data = _.get(filter, key, _.get(filters[index], 'value', null));
      if(index > -1) {
        filters.splice(index, 1, {property: key, value: _.isEmpty(data) ? filter[key]: data});
      } else {
        filters.push({ property: key, value: filter[key] });
      }
    });
    this.state.filters = filters;
  }
  confirmation(data: any[]) {
    this.selectedData = data;
    this.open = this.open ? false : this.selectedData.length > 0 ? true : false;
  }
  sortBy(state: ClrDatagridStateInterface, data: Array<any>){
    if (state.sort && state.sort.by) {
      if(state.sort.reverse) {
        return _.sortBy(data, [state.sort.by]).reverse();
      } else {
        return _.sortBy(data, [state.sort.by]);
      }
    }
    return data;
  }
}
