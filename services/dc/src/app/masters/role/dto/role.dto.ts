import { ApiProperty } from "@nestjs/swagger";

export class RoleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  roleId: number;

  
  @ApiProperty()
 roleName: string;

  @ApiProperty()
  isActive:boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdUser: string | null;

  @ApiProperty()
   updatedAt: Date;


  @ApiProperty()
  updatedUser: string | null;

  @ApiProperty()
  versionFlag: number;
    static Id: any;


  
  

}