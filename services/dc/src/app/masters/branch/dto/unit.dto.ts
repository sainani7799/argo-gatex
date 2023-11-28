import { ApiProperty } from "@nestjs/swagger";

export class UnitDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  unitName: string;

  @ApiProperty()
  isActive: boolean;


  @ApiProperty()
  versionFlag: number;


  @ApiProperty()
  createdAt: Date;

}