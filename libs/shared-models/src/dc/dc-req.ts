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
    items:ItemsReq[];
    constructor(fromUnitId :number, warehouseId:number, departmentId:number, poNo:string ,modeOfTransport:string, toAddresser:string, addresserNameId:number, weight:string, vehicleNo:string, returnable:string, purpose:string, value:string, status:StatusEnum ,requestedBy:number ,remarks:string, items:ItemsReq[]){
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
        this.items = items;
    }
}