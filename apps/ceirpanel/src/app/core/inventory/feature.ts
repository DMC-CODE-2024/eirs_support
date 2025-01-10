import { Injectable } from "@angular/core";
import { FeatureModel } from "../models/feature.model";
import { CATEGORY, CONTROLLER, NAMES } from "./values";

@Injectable()
export class FeatureInventory {
  size = 100;
  latency = 0;
  private _all: FeatureModel[] = [];
  private _currentQuery!: FeatureModel[];

  public get all(): FeatureModel[] {
    return this._all.slice();
  }
  public reset() {
    this._all = [];
    for (let i = 0; i < this.size; i++) {
      this._all.push({
        id: i + 1000,
        name: this.getItem(i, NAMES),
        category: this.getItem(i, CATEGORY),
        description: '',
        controller: this.getItem(i, CONTROLLER),
        logo: '',
        module: '',
        createDate: new Date('June 23, 1912')
      });
    }
    console.log('reset call: ', this._all);
  }
  private getItem<T>(num: number, array: T[]): T {
    return array[num % array.length];
  }
  private _checkCurrentQuery() {
    if (!this._currentQuery) {
      this._currentQuery = this._all.slice();
    }
  }

  private _fakeHttp<T>(result: T): Promise<T> {
    return new Promise(resolve => {
      setTimeout(() => resolve(result), this.latency);
    });
  }

  filter(filters: { [key: string]: string[] }): FeatureInventory {
    console.log('all: ', this._all);
    this._checkCurrentQuery();
    if (filters) {
      for (const key in filters) {
        if (filters[key].length === 0) {
          continue;
        }

        let getFilterProperty = (user: FeatureModel) => '' + user[key];
        if (key === 'name') {
          getFilterProperty = (user: FeatureModel) => user.name;
        }

        const lowerCase = filters[key].map(value => value.toLowerCase());
        this._currentQuery = this._currentQuery.filter(user => {
          for (const value of lowerCase) {
            if (getFilterProperty(user).toLowerCase().indexOf(value) >= 0) {
              return true;
            }
          }
          return false;
        });
      }
    }
    return this;
  }

  sort(sort: { by: string; reverse: boolean }): FeatureInventory {
    this._checkCurrentQuery();
    if (sort && sort.by) {
      let getSortProperty = (user: FeatureModel) => user[sort.by];
      if (sort.by === 'name') {
        getSortProperty = (user: FeatureModel) => user.name;
      }

      this._currentQuery.sort((a, b) => {
        let comp = 0;
        const propA = getSortProperty(a),
          propB = getSortProperty(b);
        if (propA < propB) {
          comp = -1;
        } else if (propA > propB) {
          comp = 1;
        }
        if (sort.reverse) {
          comp = -comp;
        }
        return comp;
      });
    }
    return this;
  }

  fetch(skip = 0, limit: number = this._currentQuery.length): Promise<FetchResult> {
    // Stringify and parse to mimic new object creation like a real HTTP request
    const items = JSON.stringify(this._currentQuery.slice(skip, skip + limit));
    const result: FetchResult = { users: JSON.parse(items), length: this._currentQuery.length };
    this._currentQuery = [];
    return this._fakeHttp(result);
  }
}
export interface FetchResult {
  users: FeatureModel[];
  length: number;
}