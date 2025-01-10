export interface UserGroupDto {
  id: {
    userId: number;
    groupId: number;
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
    };
  };
  group: {
    id: number;
    groupName: string;
  };
  totalElements: number;
  content: UserGroupDto[];
  status: string;
  createdOn: Date;
  updatedOn: Date;
}
