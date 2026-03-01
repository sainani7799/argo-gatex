import { Injectable } from "@nestjs/common";
import { CreateWarehouseDto } from "./warehouse.dto";
import { WarehouseEntity } from "../entity/warehouse.entity";

@Injectable()
export class WarehouseAdapter {
    public convertDtoToEntity(dto: CreateWarehouseDto, isUpdate: boolean = false): WarehouseEntity {
        const warehouse = new WarehouseEntity();
        warehouse.warehouseId = dto.warehouseId;
        warehouse.warehouseName = dto.warehouseName;
        warehouse.unitId = dto.unitId;
        warehouse.createdAt = dto.createdAt;
        warehouse.createdUser = dto.createdUser;
        warehouse.isActive = dto.isActive == undefined ? true : dto.isActive;
        if (isUpdate) {
            warehouse.warehouseId = dto.warehouseId;
            warehouse.warehouseName = dto.warehouseName;
            warehouse.unitId = dto.unitId;
            warehouse.updatedUser = dto.updatedUser;
        } else {
            warehouse.isActive = true;
            warehouse.createdUser = dto.createdUser;
        }
        return warehouse;
    }
        public convertEntityToDto(entity: WarehouseEntity): CreateWarehouseDto {
        const dto = new CreateWarehouseDto();
        dto.warehouseId = entity.warehouseId;
        dto.warehouseName = entity.warehouseName;
        dto.unitId = entity.unitId;
        dto.createdUser = entity.createdUser;
        dto.isActive = entity.isActive;
        dto.updatedUser = entity.updatedUser;
        dto.createdUser = entity.createdUser;
        return dto;
    }
}
