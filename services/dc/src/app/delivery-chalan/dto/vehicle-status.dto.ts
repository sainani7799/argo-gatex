import { ApiProperty } from "@nestjs/swagger";
import { TruckStateEnum } from "libs/shared-models";

export class VehicleStatusDTO {
    @ApiProperty()
    vehicleNumber: string;

    @ApiProperty()
    refId: number;// ph_id
    
    @ApiProperty()
    status: TruckStateEnum;

    @ApiProperty()
    remarks: string;
}