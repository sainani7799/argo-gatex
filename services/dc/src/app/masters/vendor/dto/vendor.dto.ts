import { ApiProperty } from "@nestjs/swagger";

export class VendorDto {
  @ApiProperty()
  vendorId: number;

  @ApiProperty()
  vendorName: string;

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