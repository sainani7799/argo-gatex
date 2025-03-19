import { ApiProperty } from "@nestjs/swagger";
import { VehilceRequestTypeEnum } from "libs/shared-models";

export class RefIdStatusDTO {
    @ApiProperty()
    refId: string;
    @ApiProperty()
    vid: bigint;
    @ApiProperty()
    status: number;
    @ApiProperty()
    vrType: VehilceRequestTypeEnum;
}