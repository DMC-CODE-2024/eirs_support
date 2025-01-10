import { FeatureModel } from "./feature.model";
import { GroupModel } from "./group.model";

export interface GroupFeatureCreateModel {
    groupId: number;
    features: number[];
    featuremap: FeatureOrderDto[];
    group: GroupModel;
}
export interface FeatureOrderDto {
    featureId: number;
    displayOrder: number;
}
export interface GroupFeatureModel{
    id: number;
    roleName: string;
    group: GroupModel;
    description: string;
    createdOn: Date;
    updatedOn: Date;
    features: FeatureModel[];
}
export interface GroupFeatureList {
    content: GroupFeatureModel[];
    totalElements: number;
}
export interface GroupFeatureFilterModel {
    startDate: Date;
    endDate: Date;
    roleName: string;
}