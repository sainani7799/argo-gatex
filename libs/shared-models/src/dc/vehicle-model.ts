import { VehicleTypeEnum } from "../enum";

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
    ){
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
    }
}