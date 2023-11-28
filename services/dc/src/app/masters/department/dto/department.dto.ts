import { ApiProperty } from "@nestjs/swagger";

export class DepartmentDto {
  @ApiProperty()
  Id: number;

  @ApiProperty()
  departmentName: string;

  @ApiProperty()
  createdUser: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  updatedUser: string | null;



  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  versionFlag: number;




}