import { ApiProperty } from "@nestjs/swagger";

export class VehicleReqDTO {

    @ApiProperty()
    vehicleNo: string;

    constructor(partial: Partial<VehicleReqDTO>) {
        Object.assign(this, partial);
    }
}