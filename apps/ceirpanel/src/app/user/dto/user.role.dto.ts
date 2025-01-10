export interface UserRoleDto {
  id: {
    userId: number;
    roleId: number;
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
  role: {
    id: number;
    roleName: string;
  };
  totalElements: number;
  content: UserRoleDto[];
  status: string;
  createdOn: Date;
  updatedOn: Date;
}
