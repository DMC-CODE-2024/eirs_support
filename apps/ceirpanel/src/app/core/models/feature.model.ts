import { ModuleMangeModel } from "./module.manage.model";
import { TagModel } from "./tag.model";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FeatureModel {
    id: number;
    featureName: string;
    category: string | '0';
    description: string;
    controller: string;
    logo: string;
    module: string;
    createdOn: Date;
    updatedOn: Date;
    defaultModuleId: number;
    defaultModule: ModuleMangeModel
    modules: ModuleMangeModel[];
    [key: string]: any;
    status: string;
    moduleTag: TagModel;
    moduleTagId: number;
    linkId: number;
    link: string;
    featureId: number;
    multiLangSupport: any;
}

export interface FeatureList {
    content: FeatureModel[];
    totalElements: number;
}
export interface FeatureFilterModel {
    startDate: Date;
    endDate: Date;
    featureName: string;
}