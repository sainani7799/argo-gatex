import { AcceptableEnum } from "../enum/is-acceptable";
import { StatusEnum } from "../enum/status-enum";
import { ItemsReq } from "./items.req";

export class DcReq{
    fromUnitId :number;
    warehouseId:number;
    departmentId:number;
    poNo:string;
    modeOfTransport:string;
    toAddresser:string;
    addresserNameId:number;
    weight:string;
    vehicleNo:string;
    returnable:string;
    purpose:string;
    value:string;
    status:StatusEnum;
    requestedBy:number;
    remarks:string;
    createdUser:string;
    dcItemDetails:ItemsReq[];
    updatedUser?:string;
    isAssignable?:AcceptableEnum;
    assignBy?:number;
    attentionPerson?:string;
    toDepartmentId?:number;
    buyerTeam?:string;
    dcType?:string;
    expectedReturnDate?:string;
    constructor(fromUnitId :number, warehouseId:number, departmentId:number, poNo:string ,modeOfTransport:string, toAddresser:string, addresserNameId:number, weight:string, vehicleNo:string, returnable:string, purpose:string, value:string, status:StatusEnum ,requestedBy:number ,remarks:string,createdUser:string, dcItemDetails:ItemsReq[],updatedUser?:string,isAssignable?:AcceptableEnum,assignBy?:number,attentionPerson?:string,toDepartmentId?:number,buyerTeam?:string , dcType?:string,expectedReturnDate?:string

    ){
        this.fromUnitId = fromUnitId;
        this.warehouseId = warehouseId;
        this.departmentId = departmentId;
        this.poNo = poNo;
        this.modeOfTransport = modeOfTransport;
        this.toAddresser = toAddresser;
        this.addresserNameId = addresserNameId;
        this.weight = weight;
        this.vehicleNo = vehicleNo;
        this.returnable = returnable;
        this.purpose = purpose;
        this.value = value;
        this.status = status;
        this.requestedBy = requestedBy;
        this.remarks = remarks;
        this.createdUser = createdUser;
        this.dcItemDetails = dcItemDetails;
        this.updatedUser = updatedUser;
        this.isAssignable = isAssignable;
        this.assignBy = assignBy;
        this.attentionPerson = attentionPerson;
        this.toDepartmentId = toDepartmentId;
        this.buyerTeam = buyerTeam;
        this.dcType = dcType;
        this.expectedReturnDate = expectedReturnDate;
    }
}