import { AcceptableEnum } from "../enum/is-acceptable";
import { StatusEnum } from "../enum/status-enum";

export class AssignReq{
    dcId:number;
    assignBy : number;
    emailId:string;
    isAssignable : AcceptableEnum;
    status:StatusEnum;
    updatedUser:string;
    constructor(dcId:number,assignBy : number,emailId:string,isAssignable : AcceptableEnum,status:StatusEnum,updatedUser:string){
            this.dcId = dcId;
            this.assignBy = assignBy;
            this.emailId = emailId;
            this.isAssignable = isAssignable;
            this.status = status;
            this.updatedUser = updatedUser
        }
}