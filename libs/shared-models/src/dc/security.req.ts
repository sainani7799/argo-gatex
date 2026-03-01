import { StatusEnum } from "../enum/status-enum";

export class SecurityCheckReq {
    dcId: number;
    status: StatusEnum;
    securityUser: string;
    checkoutTime?: Date;
    chechInTime?: Date;
    username: string;
    unitCode: string;
    companyCode: string;
    userId: number;
}