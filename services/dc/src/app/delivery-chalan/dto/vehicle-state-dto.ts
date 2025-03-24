import { ApiProperty } from "@nestjs/swagger";
import { TruckStateEnum } from "libs/shared-models";

export class VehicleStateDto {
    @ApiProperty()
    id: bigint;

    @ApiProperty()
    vid: bigint;

    @ApiProperty()
    vinrId: bigint;

    @ApiProperty()
    votrId: bigint;

    @ApiProperty()
    vehicleType: TruckStateEnum;

    @ApiProperty()
    isActive: boolean;

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
    
    constructor(partial: Partial<VehicleStateDto>) {
        Object.assign(this, partial);
    }
}
