import { Injectable } from "@nestjs/common";
import { AddressEntity } from "../entity/address.entity";
import { CreateAddressDto } from "./address.dto";

@Injectable()
export class AddressAdapter {


    public convertDtoToEntity(dto: CreateAddressDto, isUpdate: boolean = false): AddressEntity {
        const address = new AddressEntity();
        address.addressId = dto.addressId;
        address.addresser = dto.addresser;
        address.addresserNameId = dto.addresserNameId;
        address.gstNo = dto.gstNo;
        address.cstNo = dto.cstNo;
        address.lineOne = dto.lineOne;
        address.lineTwo = dto.lineTwo;
        address.city = dto.city;
        address.dist = dto.dist;
        address.pinCode = dto.pinCode;
        address.state = dto.state;
        address.country = dto.country;
        address.createdUser = dto.createdUser
        address.isActive = dto.isActive == undefined ? true : dto.isActive;
        if (isUpdate) {
            address.updatedUser = dto.updatedUser;
        } else {
            address.isActive = true;
            address.createdUser = dto.createdUser;
        }
        return address;
    }

    public convertEntityToDto(entity: AddressEntity): CreateAddressDto {
        const dto = new CreateAddressDto();
        dto.addressId = entity.addressId;
        dto.addresser = entity.addresser;
        dto.addresserNameId = entity.addresserNameId;
        dto.gstNo = entity.gstNo;
        dto.cstNo = entity.cstNo;
        dto.lineOne = entity.lineOne;
        dto.lineTwo = entity.lineTwo;
        dto.city = entity.city;
        dto.dist = entity.dist;
        dto.pinCode = entity.pinCode;
        dto.state = entity.state;
        dto.country = entity.country;
        dto.createdUser = entity.createdUser
        dto.isActive = entity.isActive;
        dto.updatedUser = entity.updatedUser;
        dto.createdUser = entity.createdUser;
        return dto;
    }

}
