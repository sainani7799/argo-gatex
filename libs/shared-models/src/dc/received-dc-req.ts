import { AcceptableEnum } from "../enum/is-acceptable";
import { StatusEnum } from "../enum/status-enum";

export class ReceivedDcReq{
    dcId:number;
    receivedDc : AcceptableEnum;
    status:StatusEnum;
    receivedUser:string;
    receivedDate?:string;
    constructor(dcId:number,receivedDc : AcceptableEnum,status:StatusEnum,receivedUser:string,receivedDate?:string){
            this.dcId = dcId;
            this.receivedDc = receivedDc;
            this.status = status;
            this.receivedUser = receivedUser;
            this.receivedDate = receivedDate;
        }
}