import { CommonRequestAttrs } from "../../common";
import { GatePassStatus } from "../../enum";

export class GatePassOutReq extends CommonRequestAttrs {
    dcNo: string;
    scVehicleId: number;
    gatePassStatus: GatePassStatus;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, dcNo: string, scVehicleId: number, gatePassStatus: GatePassStatus) {
        super(username, unitCode, companyCode, userId);
        this.dcNo = dcNo;
        this.scVehicleId = scVehicleId;
        this.gatePassStatus = gatePassStatus;
    }
}