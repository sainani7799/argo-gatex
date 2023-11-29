import { ApiProperty } from "@nestjs/swagger";

export class CreateItemDto {
    @ApiProperty()
    itemId: number;

    @ApiProperty()
    itemCode: string;

    @ApiProperty()
    itemName: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    uom: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    createdUser: string;

    @ApiProperty()
    versionFlag: number;
}