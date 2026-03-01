import { ApiProperty } from "@nestjs/swagger";

export class CreateBuyerTeamDto {
    @ApiProperty()
    buyerTeamId: number;

    @ApiProperty()
    buyerTeam: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    createdUser: string;

    @ApiProperty()
    updatedUser: string;

    @ApiProperty()
    versionFlag: number;
}