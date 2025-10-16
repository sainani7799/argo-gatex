import { Injectable } from "@nestjs/common";
import { VehicleEntity } from "../entity/vehicle.entity";
import { VehicleDto } from "./vehicle.dto";

@Injectable()
export class VehicleAdapter {
    public convertDtoToEntity(dto: VehicleDto, isUpdate: boolean = false): VehicleEntity {
        const entity = new VehicleEntity();
        entity.vehicleId = dto.vehicleId;
        entity.dcId = dto.dcId;
        entity.vehicleType = dto.vehicleType;
        entity.vehicleNo = dto.vehicleNo;
        entity.driverName = dto.driverName;
        entity.driverPhone = dto.driverPhone;
        entity.invoiceNo = dto.invoiceNo;
        entity.securityPerson = dto.securityPerson;
        entity.inTime = dto.inTime;
        entity.outTime = dto.outTime;
        entity.netWeight = dto.netWeight;
        entity.grossWeight = dto.grossWeight;
        entity.cusDecNo = dto.cusDecNo;
        entity.containerNo = dto.containerNo;
        entity.status = dto.status;
        entity.isActive = dto.isActive ?? true;
        if (isUpdate) {
            entity.updatedUser = dto.updatedUser;
            entity.updatedAt = new Date();
        } else {
            entity.createdUser = dto.createdUser;
            entity.createdAt = new Date();
            entity.isActive = true;
        }

        return entity;
    }

    public convertEntityToDto(entity: VehicleEntity): VehicleDto {
        const dto = new VehicleDto();
        dto.vehicleId = entity.vehicleId;
        dto.dcId = entity.dcId;
        dto.vehicleType = entity.vehicleType;
        dto.vehicleNo = entity.vehicleNo;
        dto.driverName = entity.driverName;
        dto.driverPhone = entity.driverPhone;
        dto.invoiceNo = entity.invoiceNo;
        dto.securityPerson = entity.securityPerson;
        dto.inTime = entity.inTime;
        dto.outTime = entity.outTime;
        dto.netWeight = entity.netWeight;
        dto.grossWeight = entity.grossWeight;
        dto.cusDecNo = entity.cusDecNo;
        dto.containerNo = entity.containerNo;
        dto.status = entity.status;
        dto.isActive = entity.isActive;
        dto.createdAt = entity.createdAt;
        dto.createdUser = entity.createdUser;
        dto.updatedUser = entity.updatedUser;
        dto.updatedAt = entity.updatedAt;
        dto.versionFlag = entity.versionFlag;

        return dto;
    }
}
