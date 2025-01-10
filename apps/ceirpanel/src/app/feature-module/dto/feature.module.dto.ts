export interface FeatureModuleDto {
    id: {
        featureId: number;
        moduleId: number;
    };
    feature: {
        createdOn: Date;
        updatedOn: Date;
        id: number;
        featureName: string;
    },
    module: {
        id: number;
        moduleName: string;
    },
    totalElements: number;
    content: FeatureModuleDto[];
    status: string;
    createdOn: Date;
    updatedOn: Date;
}