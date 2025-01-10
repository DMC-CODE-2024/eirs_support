import { FeatureModel } from "./feature.model";
import { GroupModel } from "./group.model";
import { RoleModel } from "./role.model";

 
export interface UserProfileModel {
    id: number;
    firstName: string;
    lastName: string;
    createdOn: Date;
    updatedOn: Date;
    parent: UserModel;
    selected: boolean;
    address: string;
    country: string;
    stateName: string;
    province: string;
    district: string;
    commune: string;
    village: string;
    street: string;
    locality: string;
    postalCode: string;
    companyName: string;
    designation: string;
    nationalId: string;
    uploadNationalId: string;
    uploadUserPhoto: string;
    employeeId: string;
    idCardFileName: string;
    natureOfEmployment: string;
    authorityName: string;
    authorityEmail: string;
    authorityPhoneNo: string;
    password: string;
    confirm: string;
    email: string;
    phoneNo: string;
    question1: number;
    question2: number;
    question3: number;
    answer1: string;
    answer2: string;
    answer3: string;
    nidFileName: string;
    photoFileName: string;
}
export interface UserModel {
    id: number;
    userName: string;
    password: string;
    token: string;
    type: string;
    createdOn: Date;
    updatedOn: Date;
    selected: boolean;
    profile: UserProfileModel;
    roles: RoleModel[];
    groups: GroupModel[];
    features: FeatureModel[];
    questions: Question[];
    currentStatus: string;
    captcha: string;
}
export interface UserList {
    content: UserModel[];
    totalElements: number;
}
export interface Question {
    id: {
        userId: number;
        questionId: number;
    },
    questionId: number;
    answer: string;
}
export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}