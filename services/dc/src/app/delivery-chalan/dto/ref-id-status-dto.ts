import { ApiProperty } from "@nestjs/swagger";
import { ReqStatus, VehilceRequestTypeEnum } from "@gatex/shared-models";

export class RefIdStatusDTO {
    @ApiProperty()
    refId: string;
    @ApiProperty()
    vid: number;
    @ApiProperty()
    status: number;
    @ApiProperty()
    vrType: VehilceRequestTypeEnum;
    @ApiProperty()
    reqStatus: ReqStatus;
    @ApiProperty()
    vehicleNo: string;

    constructor(partial: Partial<RefIdStatusDTO>) {
        Object.assign(this, partial);
    }
}