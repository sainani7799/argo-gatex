import { AcceptableEnum } from "../enum/is-acceptable";
import { StatusEnum } from "../enum/status-enum";

export class RejectDcReq{
    dcId:number;
    isAccepted:AcceptableEnum;
    acceptedUser:number;
    status:StatusEnum;
    constructor(isAccepted:AcceptableEnum, acceptedUser:number, status:StatusEnum){
        this.isAccepted = isAccepted;
        this.acceptedUser = acceptedUser;
        this.status = status;
    }
}