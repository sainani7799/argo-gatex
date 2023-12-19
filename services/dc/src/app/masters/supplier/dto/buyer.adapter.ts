import { Injectable } from "@nestjs/common";
import { CreateSupplierDto } from "./supplier.dto";
import { SupplierEntity } from "../entity/supplier.entity";

@Injectable()
export class SupplierAdapter {
    public convertDtoToEntity(dto: CreateSupplierDto, isUpdate: boolean = false): SupplierEntity {
        const buyer = new SupplierEntity();
        buyer.supplierId = dto.supplierId;
        buyer.supplierCode = dto.supplierCode;
        buyer.supplierName = dto.supplierName;
        buyer.createdAt = dto.createdAt;
        buyer.createdUser = dto.createdUser;
        buyer.isActive = dto.isActive == undefined ? true : dto.isActive;
        if (isUpdate) {
            buyer.supplierCode = dto.supplierCode;
            buyer.supplierName = dto.supplierName;
            buyer.updatedUser = dto.updatedUser;
        } else {
            buyer.isActive = true;
            buyer.createdUser = dto.createdUser;
        }
        return buyer;
    }
        public convertEntityToDto(entity: SupplierEntity): CreateSupplierDto {
        const dto = new CreateSupplierDto();
        dto.supplierId = entity.supplierId;
        dto.supplierCode = entity.supplierCode;
        dto.supplierName = entity.supplierName;
        dto.createdUser = entity.createdUser;
        dto.isActive = entity.isActive;
        dto.updatedUser = entity.updatedUser;
        dto.createdUser = entity.createdUser;
        return dto;
    }
}
