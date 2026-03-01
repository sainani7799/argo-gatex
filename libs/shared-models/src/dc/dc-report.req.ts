export class DcReportReq{
    dcId :number;
    itemCodeId:number;
    dcFromDate:any;
    dcToDate:any;
    fromUnit:number;
    toUnit:number[];
    approvedBy:number;
    checkedBy:number;
    buyer:number;
    receivedBy:number;
    purpose:string;
    createdBy:number;
}