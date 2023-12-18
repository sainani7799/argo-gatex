import { AcceptableEnum } from "../enum/is-acceptable";
import { StatusEnum } from "../enum/status-enum";

export class ReceivedDcReq{
    dcId:number;
    receivedDc : AcceptableEnum;
    status:StatusEnum;
    receivedUser:string;
    constructor(dcId:number,receivedDc : AcceptableEnum,status:StatusEnum,receivedUser:string){
            this.dcId = dcId;
            this.receivedDc = receivedDc;
            this.status = status;
            this.receivedDc = receivedDc;
            this.receivedUser = receivedUser;
        }
}