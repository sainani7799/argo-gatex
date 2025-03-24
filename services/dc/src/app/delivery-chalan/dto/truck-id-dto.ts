import { ApiProperty } from "@nestjs/swagger";
import { TruckStateEnum, VehilceRequestTypeEnum } from "libs/shared-models";

export class TruckIdReqeust {

    @ApiProperty()
    truckId: bigint;

    @ApiProperty()
    vinrId: bigint;
   
    @ApiProperty()
    votrId: bigint;

    @ApiProperty()
    state: TruckStateEnum;

    @ApiProperty()
    vrType: VehilceRequestTypeEnum;

    @ApiProperty()
    dateTime: string;

    @ApiProperty()
    person: string;
}

