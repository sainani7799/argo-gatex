import { TruckStateEnum, VehicleTypeEnum } from "../enum";

export class HistoryRecord {
    inAt: Date;
    originalUnloadingStartTime: Date;
    unloadStartAt: Date;
    unloadCompleteAt: Date;
    unloadPauseAt: Date;
    outAt: Date;
}
export class VehicleModal {
    id: number;
    vehicleNo: string;
    dName: string;
    dContact: string;
    arrivalDateTime: Date;
    departureDateTime: Date;
    vehicleType: VehicleTypeEnum;
    inHouseVehicle: boolean;
    vinrId: number;
    votrId: number;
    vState: TruckStateEnum;
    historyData: HistoryRecord;
    constructor(
        id: number,
        vehicleNo: string,
        dName: string,
        dContact: string,
        arrivalDateTime: Date,
        departureDateTime: Date,
        vehicleType: VehicleTypeEnum,
        inHouseVehicle: boolean,
        vinrId: number,
        votrId: number,
        vState: TruckStateEnum,
        historyData?: HistoryRecord
    ) {
        this.id = id;
        this.vehicleNo = vehicleNo;
        this.dName = dName;
        this.dContact = dContact;
        this.arrivalDateTime = arrivalDateTime;
        this.departureDateTime = departureDateTime;
        this.vehicleType = vehicleType;
        this.inHouseVehicle = inHouseVehicle;
        this.vinrId = vinrId;
        this.votrId = votrId;
        this.historyData = historyData;
        this.vState = vState;
    }
}