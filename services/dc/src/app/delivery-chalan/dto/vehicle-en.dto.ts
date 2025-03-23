import { ApiProperty } from "@nestjs/swagger";
import { VehicleTypeEnum } from "libs/shared-models";

export class VehicleDto {
    
    @ApiProperty()
    id: number;

    @ApiProperty()
    vehicleNo: string;

    @ApiProperty()
    dName: string;

    @ApiProperty()
    dContact: string;

    @ApiProperty()
    arrivalDateTime: Date;

    @ApiProperty()
    departureDateTime: Date;

    @ApiProperty()
    vehicleType: VehicleTypeEnum;

    @ApiProperty()
    inHouseVehicle: boolean;

    @ApiProperty()
    vinrId: number;

    @ApiProperty()
    votrId: number;

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
}
