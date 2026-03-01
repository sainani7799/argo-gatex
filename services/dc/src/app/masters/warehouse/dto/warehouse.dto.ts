import { ApiProperty } from "@nestjs/swagger";

export class CreateWarehouseDto {
    @ApiProperty()
    warehouseId: number;

    @ApiProperty()
    warehouseName: string;

    @ApiProperty()
    unitId:number;

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