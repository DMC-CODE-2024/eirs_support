import { Injectable } from '@angular/core';
import { FeatureModel } from '../../core/models/feature.model';

@Injectable()
export class Inventory {
  size = 100;
  latency = 0;
  private _all!: FeatureModel[];
  private _currentQuery!: FeatureModel[];

  set all(all: FeatureModel[]) {
    this._all = all;
  }
  get all(): FeatureModel[] {
    return this._all.slice();
  }
  reset() {
    this._all = [];
    this._currentQuery = [];
  }

  sort(sort: { by: string; reverse: boolean }): Inventory {
    this._checkCurrentQuery();
    if (sort && sort.by) {
      const getSortProperty = (user: FeatureModel) => user[sort.by];
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

  fetch(
    skip = 0,
    limit: number = this._currentQuery.length
  ): Promise<FetchResult> {
    // Stringify and parse to mimic new object creation like a real HTTP request
    const items = JSON.stringify(this._currentQuery.slice(skip, skip + limit));
    const result: FetchResult = {
      users: JSON.parse(items),
      length: this._currentQuery.length,
    };
    // this._currentQuery = [];
    return this._fakeHttp(result);
  }

  // Used by an iterator to pull an item out of an array in a repeatable way.
  private getItem<T>(num: number, array: T[]): T {
    return array[num % array.length];
  }

  private _checkCurrentQuery() {
    if (this._currentQuery.length == 0) {
      this._currentQuery = this._all.slice();
    }
  }

  private _fakeHttp<T>(result: T): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(result), this.latency);
    });
  }
}
export interface FetchResult {
  users: FeatureModel[];
  length: number;
}
