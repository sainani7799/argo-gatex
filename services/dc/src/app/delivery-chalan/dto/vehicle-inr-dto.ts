import { ApiProperty } from "@nestjs/swagger";
import { LocationFromTypeEnum, LocationToTypeEnum, ReqStatus } from "libs/shared-models";
import { VehicleDto } from "./vehicle-en.dto";

export class VehicleINRDto {
    @ApiProperty()
    id: bigint;

    @ApiProperty()
    refId: string;

    @ApiProperty()
    refNumber: string;

    @ApiProperty()
    expectedArrival: Date;

    @ApiProperty()
    from: string;

    @ApiProperty()
    to: string;

    @ApiProperty()
    fromType: LocationFromTypeEnum;

    @ApiProperty()
    toType: LocationToTypeEnum;

    @ApiProperty()
    readyToIn: number;

    @ApiProperty()
    reqStatus: ReqStatus;

    @ApiProperty()
    hasItems: number;

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

    @ApiProperty()
    vehicleRecords:VehicleDto[];

    constructor(partial: Partial<VehicleINRDto>) {
        Object.assign(this, partial);
    }
}
