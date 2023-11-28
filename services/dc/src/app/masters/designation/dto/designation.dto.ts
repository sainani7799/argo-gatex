import { ApiProperty } from "@nestjs/swagger";

export class DesignationDto {
  @ApiProperty()
  designationId: number;

  @ApiProperty()
  designation: string;

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