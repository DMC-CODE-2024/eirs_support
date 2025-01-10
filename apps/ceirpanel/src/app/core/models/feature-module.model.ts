import { FeatureModel } from "./feature.model";
import { ModuleMangeModel } from "./module.manage.model";

export interface FeatureModuleCreateModel {
    featureId: number;
    modules: number[];
    feature: FeatureModel;
}
export interface FeatureModuleModel{
    id: number;
    roleName: string;
    feature: FeatureModel;
    description: string;
    createdOn: Date;
    updatedOn: Date;
    featureName: string;
    modules: ModuleMangeModel[];
    defaultModule: ModuleMangeModel;
}
export interface FeatureModuleList {
    content: FeatureModuleModel[];
    totalElements: number;
}
export interface FeatureModuleFilterModel {
    startDate: Date;
    endDate: Date;
    roleName: string;
}