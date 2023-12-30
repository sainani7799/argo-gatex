import { StatusEnum } from "../enum/status-enum";

export class SecurityCheckReq{
    dcId:number;
    status:StatusEnum;
    securityUser:string;
    checkoutTime?:Date
}