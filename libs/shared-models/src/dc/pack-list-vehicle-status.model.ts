import { TruckStateEnum } from "../enum";

export class PackListVehicleStatusResp {
    inAt: Date;
    outAt: Date;
    unloadStartAt: Date;
    unloadCompleteAt: Date;
    vehicleNumber: string;
    driverName: string;
    invoiceNo: string;
    id: number;
    vehicleContact: string;
    status: TruckStateEnum;
    constructor(inAt: Date,
        outAt: Date,
        unloadStartAt: Date,
        unloadCompleteAt: Date,
        vehicleNumber: string,
        driverName: string,
        invoiceNo: string,
        id: number,
        vehicleContact: string,
        status: TruckStateEnum) {
        this.inAt = inAt;
        this.outAt = outAt;
        this.unloadStartAt = unloadStartAt;
        this.unloadCompleteAt = unloadCompleteAt;
        this.vehicleNumber = vehicleNumber;
        this.driverName = driverName;
        this.invoiceNo = invoiceNo;
        this.id = id;
        this.vehicleContact = vehicleContact;
        this.status = status;



    }
}
