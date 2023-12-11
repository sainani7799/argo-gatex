import { ApiProperty } from "@nestjs/swagger";
import { AcceptableEnum, StatusEnum } from "libs/shared-models";
import { DcItemsDto } from "./dc-items.dto";

export class DcDto {
    @ApiProperty()
    dcId: number;
    @ApiProperty()
    dcNumber: string;
    @ApiProperty()
    fromUnitId: number;
    @ApiProperty()
    warehouseId: number;
    @ApiProperty()
    departmentId: number;
    @ApiProperty()
    poNo: string;
    @ApiProperty()
    modeOfTransport: string;
    @ApiProperty()
    toAddresser: string;
    @ApiProperty()
    addresserNameId: number;
    @ApiProperty()
    weight: string;
    @ApiProperty()
    vehicleNo: string;
    @ApiProperty()
    returnable: string;
    @ApiProperty()
    purpose: string;
    @ApiProperty()
    value: string;
    @ApiProperty()
    status: StatusEnum;
    @ApiProperty()
    requestedBy: number;
    @ApiProperty()
    remarks: string;
    @ApiProperty()
    isAccepted:AcceptableEnum;
    @ApiProperty()
    isAssignable:AcceptableEnum;
    @ApiProperty()
    assignBy:number;
    @ApiProperty({ type: DcItemsDto })
    dcItemDetails: DcItemsDto[];
    @ApiProperty()
    createdAt?: Date;
    @ApiProperty()
    createdUser?: string | null;
    @ApiProperty()
    updatedAt?: Date;
    @ApiProperty()
    updatedUser?: string | null;
    @ApiProperty()
    isActive?: boolean;
    @ApiProperty()
    versionFlag?: number;
    @ApiProperty()
    acceptedUser?: number;
    /**
     * 
     * @param dcId 
     * @param dcNumber 
     * @param fromUnitId 
     * @param warehouseId 
     * @param departmentId 
     * @param poNo 
     * @param modeOfTransport 
     * @param toAddresser 
     * @param addresserNameId 
     * @param weight 
     * @param vehicleNo 
     * @param returnable 
     * @param purpose 
     * @param value 
     * @param status 
     * @param requestedBy 
     * @param remarks 
     * @param dcItemDetails 
     * @param createdAt 
     * @param createdUser 
     * @param updatedAt 
     * @param updatedUser 
     * @param isActive 
     * @param versionFlag 
     */
    constructor( dcId: number, dcNumber: string, fromUnitId: number, warehouseId: number, departmentId: number, poNo: string, modeOfTransport: string, toAddresser: string, addresserNameId: number, weight: string, vehicleNo: string, returnable: string, purpose: string, value: string, status: StatusEnum, requestedBy: number, remarks: string, isAccepted:AcceptableEnum, isAssignable:AcceptableEnum,assignBy:number,dcItemDetails: DcItemsDto[], createdAt?: Date, createdUser?: string | null, updatedAt?: Date, updatedUser?: string | null, isActive?: boolean, versionFlag?: number,acceptedUser?: number
    ){
        this.dcId = dcId;
        this.dcNumber = dcNumber;
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
        this.isAccepted = isAccepted;
        this.isAssignable = isAssignable;
        this.assignBy = assignBy;
        this.dcItemDetails = dcItemDetails;
        this.createdAt = createdAt;
        this.createdUser = createdUser;
        this.updatedAt = updatedAt;
        this.updatedUser = updatedUser;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.acceptedUser = acceptedUser;
    }
}