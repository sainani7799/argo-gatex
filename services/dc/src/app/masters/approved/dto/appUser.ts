import { ApiProperty } from '@nestjs/swagger';

export class ApprovedUserDto {
  @ApiProperty()
  approvedId: number;

  @ApiProperty()
  approvedUserName: string;

  @ApiProperty()
  emailId: string;

  @ApiProperty()
  sigImageName: string;

  @ApiProperty()
  signPath: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt : Date;

  @ApiProperty()
  createdUser : string;

  @ApiProperty()
  versionFlag : number;
}