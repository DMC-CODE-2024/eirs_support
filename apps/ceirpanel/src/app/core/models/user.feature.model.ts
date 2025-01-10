import { FeatureModel } from "./feature.model";
import { UserModel } from "./user.model";

export interface UserFeatureCreateModel {
    userId: number;
    features: number[];
    user: UserModel;
}
export interface UserFeatureModel{
    id: number;
    roleName: string;
    user: UserModel;
    description: string;
    createdOn: Date;
    updatedOn: Date;
    features: FeatureModel[];
}
export interface UserFeatureList {
    content: UserFeatureModel[];
    totalElements: number;
}
export interface UserFeatureFilterModel {
    startDate: Date;
    endDate: Date;
    roleName: string;
}