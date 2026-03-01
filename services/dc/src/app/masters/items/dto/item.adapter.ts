import { Injectable } from "@nestjs/common";
import { ItemEntity } from "../entity/item.entity";
import { CreateItemDto } from "./item.dto";

@Injectable()
export class itemsAdapter {
    public convertDtoToEntity(dto: CreateItemDto, isUpdate: boolean = false): ItemEntity {
        const item = new ItemEntity();
        item.itemId = dto.itemId;
        item.itemCode = dto.itemCode;
        item.itemName = dto.itemName;
        item.description = dto.description;
        item.uom = dto.uom;
        item.createdAt = dto.createdAt;
        item.createdUser = dto.createdUser;
        item.itemType = dto.itemType;
        item.isActive = dto.isActive == undefined ? true : dto.isActive;
        if (isUpdate) {
            item.updatedUser = dto.updatedUser;
        } else {
            item.isActive = true;
            item.createdUser = dto.createdUser;
        }
        return item;
    }
        public convertEntityToDto(entity: ItemEntity): CreateItemDto {
        const dto = new CreateItemDto();
        dto.itemId = entity.itemId;
        dto.itemCode = entity.itemCode;
        dto.itemName = entity.itemName;
        dto.uom = entity.uom;
        dto.description = entity.description;
        dto.itemType = entity.itemType;
        dto.createdUser = entity.createdUser;
        dto.isActive = entity.isActive;
        dto.updatedUser = entity.updatedUser;
        dto.createdUser = entity.createdUser;
        return dto;
    }
}
