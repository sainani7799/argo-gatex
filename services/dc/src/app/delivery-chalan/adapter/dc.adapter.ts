import { Injectable } from "@nestjs/common";
import { DcDto } from "../dto/dc.dto";
import { DcEntity } from "../entity/dc.entity";
import { DcItemEntity } from "../entity/dc-items.entity";
import { DcItemsDto } from "../dto/dc-items.dto";

@Injectable()

export class DcAdapter
{
    public convertDtoToEntity(dcDto:DcDto, isUpdate: boolean = false ):DcEntity{
        const dcEntity = new DcEntity
        dcEntity.dcId = dcDto.dcId;
        dcEntity.dcNumber = dcDto.dcNumber;
        dcEntity.fromUnitId = dcDto.fromUnitId;
        dcEntity.warehouseId = dcDto.warehouseId;
        dcEntity.departmentId = dcDto.departmentId;
        dcEntity.poNo = dcDto.poNo;
        dcEntity.modeOfTransport = dcDto.modeOfTransport;
        dcEntity.toAddresser = dcDto.toAddresser;
        dcEntity.addresserNameId = dcDto.addresserNameId;
        dcEntity.weight = dcDto.weight;
        dcEntity.vehicleNo = dcDto.vehicleNo;
        dcEntity.returnable = dcDto.returnable;
        dcEntity.purpose = dcDto.purpose;
        dcEntity.value = dcDto.value;
        dcEntity.status = dcDto.status;
        dcEntity.requestedBy = dcDto.requestedBy;
        dcEntity.remarks = dcDto.remarks;
        dcEntity.isAccepted = dcDto.isAccepted;
        dcEntity.assignBy = dcDto.assignBy;
        dcEntity.isAssignable = dcDto.isAssignable;
        dcEntity.createdAt = dcDto.createdAt;
        dcEntity.createdUser = dcDto.createdUser;
        dcEntity.acceptedUser = dcDto.acceptedUser;
        if(isUpdate){
            dcEntity.updatedUser = dcDto.updatedUser;
            dcEntity.assignBy = dcDto.assignBy;
            dcEntity.isAssignable = dcDto.isAssignable;
            dcEntity.acceptedUser = dcDto.acceptedUser;
            dcEntity.isAccepted = dcDto.isAccepted;
        }else{
            dcEntity.isActive = true;
            dcEntity.createdUser = dcDto.createdUser
        }
        const itemDetails: DcItemEntity[]=[]
        for(const dcItems of dcDto.dcItemDetails){
            const dcItemEntity:DcItemEntity = new DcItemEntity()
            if(!isUpdate){
                dcEntity.createdUser = dcDto.createdUser;
            }else{
                dcItemEntity.dcItemId = dcItems.dcItemId;
                dcEntity.updatedUser = dcDto.updatedUser
            }
            dcItemEntity.itemCode = dcItems.itemCode;
            dcItemEntity.itemName = dcItems.itemName;
            dcItemEntity.description = dcItems.description;
            dcItemEntity.uom = dcItems.uom;
            dcItemEntity.qty = dcItems.qty;
            dcItemEntity.rate = dcItems.rate;
            dcItemEntity.amount = dcItems.amount;
            itemDetails.push(dcItemEntity)
        }
        
        dcEntity.dcItemInfo = itemDetails
        console.log(dcEntity)
        return dcEntity
        
    }
    public convertEntityToDto(dcObject: DcEntity): DcDto {
        const itemDto:DcItemsDto[] = []
        for(const dcItems of dcObject.dcItemInfo ){
            const itemData = new DcItemsDto(dcItems.dcItemId,dcItems.itemCode,dcItems.itemName,dcItems.description,dcItems.uom,dcItems.qty,dcItems.rate,dcItems.amount,dcItems.isActive,dcItems.createdAt,dcItems.createdUser,dcItems.updatedAt,dcItems.updatedUser);
            itemDto.push(itemData)
        }
        const dcDto = new DcDto(dcObject.dcId,dcObject.dcNumber,dcObject.fromUnitId,dcObject.warehouseId,dcObject.departmentId,dcObject.poNo,dcObject.modeOfTransport,dcObject.toAddresser,dcObject.addresserNameId,dcObject.weight,dcObject.vehicleNo,dcObject.returnable,dcObject.purpose,dcObject.value,dcObject.status,dcObject.requestedBy,dcObject.remarks,dcObject.isAccepted,dcObject.isAssignable,dcObject.assignBy,itemDto,dcObject.createdAt,dcObject.createdUser,dcObject.updatedAt,dcObject.updatedUser,dcObject.isActive,dcObject.versionFlag,dcObject.acceptedUser) 
        return dcDto
    }
}
   