import { ApiProperty } from "@nestjs/swagger";

export class ProjectDto {
  @ApiProperty()
  projectId: number;

  @ApiProperty()
  projectName: string;

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