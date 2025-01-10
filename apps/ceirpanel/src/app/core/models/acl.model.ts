import { FeatureModel } from "./feature.model";
import { ModuleMangeModel } from "./module.manage.model";
import { RoleModel } from "./role.model";

export interface AclCreateModel {
    roleId: number;
    featureModules: number[];
    role: RoleModel;
    features: Array<AclFeature>;
}
export interface AclFeature {
    id: number;
    modules: Array<AclModule>
}
export interface AclModule {
    id: number;
}
export interface AclModel{
    id: {
        roleId: number;
        featureId: number;
        moduleId: number;
    };
    roleId: number;
    role: RoleModel;
    featureModuleOverrideLink: string;
    description: string;
    createdOn: Date;
    updatedOn: Date;
    features: FeatureModel[];
    feature: FeatureModel;
    module: ModuleMangeModel;
    status: string;
}
export interface AclList {
    content: AclModel[];
    totalElements: number;
}
export interface AclFilterModel {
    startDate: Date;
    endDate: Date;
    roleName: string;
}