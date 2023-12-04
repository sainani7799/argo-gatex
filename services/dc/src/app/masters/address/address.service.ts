import { Injectable } from "@nestjs/common";
import { AddressEntityRepository } from "./repository/address.repository";
import { CreateAddressDto } from "./dto/address.dto";
import { CommonResponse } from "libs/shared-models/src/common";
import { AppDataSource } from "../../app-data-source";
import { AddressEntity } from "./entity/address.entity";

@Injectable()
export class AddressService {
  constructor(
    private addressRepo: AddressEntityRepository,
    
  ) { }

  async createAddress(dto:CreateAddressDto | CreateAddressDto[]):Promise<CommonResponse>{
    try{
      const address = Array.isArray(dto) ? dto : [dto];
        for( const obj of address){
            const existingAddress = await AppDataSource.getRepository(AddressEntity).findOne({where:{addresser:obj.addresser,addresserName:obj.addresserName}})
            if(existingAddress){
                return await new CommonResponse(false,444,'already address created for this name',existingAddress)
            }else{
                for(const obj of address){
                    const entity = new AddressEntity()
                    entity.addressId = obj.addressId;
                    entity.addresser = obj.addresser;
                    entity.addresserName = obj.addresserName;
                    entity.lineOne = obj.lineOne;
                    entity.lineTwo = obj.lineTwo;
                    entity.city = obj.city;
                    entity.dist = obj.dist;
                    entity.pinCode = obj.pinCode;
                    entity.state = obj.state;
                    entity.country = obj.country;
                    entity.createdUser = obj.createdUser;
                    const save = await AppDataSource.getRepository(AddressEntity).save(entity)
                    return new CommonResponse(true,555,'create successfully ',save)
                }
            }
        }
    }catch(error){
        console.log(error)
    }
  }

  async getAllAddress(): Promise<CommonResponse> {
    try {
      const query = `SELECT a.address_id AS addressId,addresser, CASE WHEN addresser = 'unit' THEN u.unit_name WHEN addresser = 'supplier' THEN s.supplier_name END AS addresserName, line_one AS lineOne, line_two AS lineTwo, city, dist, pin_code AS pinCode, state, country, a.created_at AS createdAt 
      FROM shahi_address a
      LEFT JOIN shahi_units u ON u.id = a.addresser_name AND a.addresser = 'unit'
      LEFT JOIN shahi_suppliers s ON s.supplier_id = a.addresser_name AND a.addresser = 'supplier'
      WHERE addresser IN ('unit', 'supplier')`;
      const data = await AppDataSource.query(query)
      return new CommonResponse(true, 111, 'data retried successfully', data)
    } catch (error) {
      console.log(error)
    }
  }

}