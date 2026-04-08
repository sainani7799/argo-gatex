import { LocationFromTypeEnum, LocationToTypeEnum, ReqStatus } from "@gatex/shared-models";
import { ApiProperty } from "@nestjs/swagger";
import { VehicleDto } from "./vehicle-en.dto";

export class VehicleOTRDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    refId: string;

    @ApiProperty()
    refNumber: string;

    @ApiProperty()
    expectedDeparture: Date;

    @ApiProperty()
    from: string;

    @ApiProperty()
    to: string;

    @ApiProperty()
    fromType: LocationFromTypeEnum;

    @ApiProperty()
    toType: LocationToTypeEnum;

    @ApiProperty()
    readyToSend: number;

    @ApiProperty()
    reqStatus: ReqStatus;

    @ApiProperty()
    hasItems: number;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    createdUser: string;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    updatedUser: string;

    @ApiProperty()
    versionFlag: number;

    @ApiProperty()
    mailRecipent: string[];

    @ApiProperty()
    approvelUrl: string;

    @ApiProperty()
    apiMethod: string; //by default POST

    @ApiProperty()
    vehicleRecords: VehicleDto[];
}
