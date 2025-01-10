export interface UserFeatureDto {
    id: {
        userId: number;
        featureId: number;
    };
    user: {
        createdOn: Date;
        updatedOn: Date;
        id: number;
        userName: string;
        profile: {
            createdOn: Date;
            updatedOn: Date;
            firstName: string;
            lastName: string;
        }
    },
    feature: {
        id: number;
        featureName: string;
    },
    totalElements: number;
    content: UserFeatureDto[];
    status: string;
    createdOn: Date;
    updatedOn: Date;
}