import { VehilceRequestTypeEnum } from "../enum";

export class RefIdStatusReq {
    refId?: string;
    vid?: bigint;
    status?: number;
    vrType?: VehilceRequestTypeEnum;
}