/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { AclModel } from '../../core/models/acl.model';
import { FeatureModuleModel } from '../../core/models/feature-module.model';

@Injectable({
  providedIn: 'root'
})
export class DualBoxService {
  public getDualList(fmList: Array<FeatureModuleModel>, aclModel: AclModel) {
    const dualList: any[] = [];
    let max = 0;
    fmList.forEach(fm => {
      const id = aclModel.features.find((o) => o.featureId == fm.id);
      const obj = { id: fm.id, name: fm.featureName, selected: id ? true : false };
      const mlist = [];
      if (fm && fm.modules && fm.modules.length > 0) {
        const sf = aclModel.features.find((o) => o.featureId == fm.id);
        fm.modules.forEach(m => {
          const module = sf?.modules?.find((o) => o.moduleId == m.id);
          let mobj = { id: m.id, name: m.moduleName, selected: module ? true : false, disabled: false };
          if (m.moduleTag && m.moduleTag.moduleTagName) mobj = Object.assign(mobj, { tag: m.moduleTag.moduleTagName });
          mlist.push(mobj);
        });
      } else if (fm.defaultModule) {
        let mobj = { id: fm.defaultModule.id, name: fm.defaultModule.moduleName, selected: false, disabled: false };
        if (fm.defaultModule.moduleTag && fm.defaultModule.moduleTag.moduleTagName) mobj = Object.assign(mobj, { tag: fm.defaultModule.moduleTag.moduleTagName });
        mlist.push(mobj);
      }
      max = max < mlist.length ? mlist.length : max;
      obj.selected = mlist.filter(m => m.selected).length == mlist.length;
      dualList.push(Object.assign(obj, { childs: mlist }));
    });
    console.log('max: ', max);
    dualList.forEach(d => {
      for (let i = d.childs.length; i < max; i++) {
        d.childs.push({id: -1, name: '--',selected: false, disabled: true});  
      }
    });
    return { childs: dualList, name: 'Permissions', selected: dualList.filter(m => m.selected).length == dualList.length, expanded: true };
  }
}
