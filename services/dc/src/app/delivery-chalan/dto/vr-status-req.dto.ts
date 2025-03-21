import { ApiProperty } from "@nestjs/swagger";
import { LocationFromTypeEnum } from "libs/shared-models";

export class VRStatusDTO {
    @ApiProperty()
    status: number[];
    @ApiProperty()
    fromType: LocationFromTypeEnum;
}