import { Injectable } from "@nestjs/common";
import { AddressEntityRepository } from "./repository/address.repository";
import { CreateAddressDto } from "./dto/address.dto";
import { CommonResponse } from "libs/shared-models/src/common";
import { AppDataSource } from "../../app-data-source";
import { AddressEntity } from "./entity/address.entity";
import { Raw } from "typeorm";
import { AddressAdapter } from "./dto/address.adapter";
import { ToAddressReq, UnitReq } from "libs/shared-models";

@Injectable()
export class AddressService {
  constructor(
    private addressRepo: AddressEntityRepository,
    private addressAdapter: AddressAdapter,
    
  ) { }

  // async createAddress(dto:CreateAddressDto | CreateAddressDto[],isUpdate:boolean):Promise<CommonResponse>{
  //   try{
  //     const address = Array.isArray(dto) ? dto : [dto];
  //     if(!isUpdate){
  //       for( const obj of address){
  //         const existingAddress = await AppDataSource.getRepository(AddressEntity).findOne({where:{addresser:obj.addresser,addresserName:obj.addresserName}})
  //         if(existingAddress){
  //             return await new CommonResponse(false,444,'already address created for this name',existingAddress)
  //         }
  //       }
  //     }else{
  //       for( const obj of address){
  //         const existingAddress = await AppDataSource.getRepository(AddressEntity).findOne({where:{addresser:obj.addresser,addresserName:obj.addresserName}})
  //         if(existingAddress){
  //             return await new CommonResponse(false,444,'already address created for this name',existingAddress)
  //         }else{
  //             for(const obj of address){
  //                 const entity = new AddressEntity()
  //                 entity.addressId = obj.addressId;
  //                 entity.addresser = obj.addresser;
  //                 entity.addresserName = obj.addresserName;
  //                 entity.lineOne = obj.lineOne;
  //                 entity.lineTwo = obj.lineTwo;
  //                 entity.city = obj.city;
  //                 entity.dist = obj.dist;
  //                 entity.pinCode = obj.pinCode;
  //                 entity.state = obj.state;
  //                 entity.country = obj.country;
  //                 entity.createdUser = obj.createdUser;
  //                 const save = await AppDataSource.getRepository(AddressEntity).save(entity)
  //                 return new CommonResponse(true,555,'create successfully ',save)
  //             }
  //         }
  //     }
  //     }
  //       for( const obj of address){
  //           const existingAddress = await AppDataSource.getRepository(AddressEntity).findOne({where:{addresser:obj.addresser,addresserName:obj.addresserName}})
  //           if(existingAddress){
  //               return await new CommonResponse(false,444,'already address created for this name',existingAddress)
  //           }else{
  //               for(const obj of address){
  //                   const entity = new AddressEntity()
  //                   entity.addressId = obj.addressId;
  //                   entity.addresser = obj.addresser;
  //                   entity.addresserName = obj.addresserName;
  //                   entity.lineOne = obj.lineOne;
  //                   entity.lineTwo = obj.lineTwo;
  //                   entity.city = obj.city;
  //                   entity.dist = obj.dist;
  //                   entity.pinCode = obj.pinCode;
  //                   entity.state = obj.state;
  //                   entity.country = obj.country;
  //                   entity.createdUser = obj.createdUser;
  //                   const save = await AppDataSource.getRepository(AddressEntity).save(entity)
  //                   return new CommonResponse(true,555,'create successfully ',save)
  //               }
  //           }
  //       }
  //   }catch(error){
  //       console.log(error)
  //   }
  // }

  async getAddressWithoutRelations(addresserNameId: number): Promise<AddressEntity>{
    const addressResponse = await AppDataSource.getRepository(AddressEntity).findOne({
      where: {addresserNameId: Raw(alias => `addresser_name_Id = '${addresserNameId}'`)},
    });
    if(addressResponse){
      return addressResponse;
    }
    else{
      return null;
    }
  }


  async createAddress(addressDto: CreateAddressDto, isUpdate: boolean): Promise<CommonResponse>{
    console.log('isUpdate============',isUpdate)
    try{
      let previousValue
    const addressDtos: CreateAddressDto[] = [];

      if(!isUpdate){

        const addressEntity = await this.getAddressWithoutRelations(addressDto.addresserNameId);
        if (addressEntity){
            console.log(addressEntity,'------')
          throw new CommonResponse(false,11104, 'addressEntity already exists'); 
        }
      }
      else{
        const certificatePrevious = await AppDataSource.getRepository(AddressEntity).findOne({where:{addressId:addressDto.addressId}})
        previousValue =(certificatePrevious.addresserNameId)
        const addressEntity = await this.getAddressWithoutRelations(addressDto.addresserNameId);
        if (addressEntity){
          if(addressEntity.addresserNameId != addressDto.addresserNameId ){
            throw new CommonResponse(false,11104, 'Address already exists'); 
          }
        }
      }
      const convertedAddressEntity: AddressEntity = this.addressAdapter.convertDtoToEntity(addressDto,isUpdate);

      console.log(convertedAddressEntity);
    const savedAddressEntity: AddressEntity = await AppDataSource.getRepository(AddressEntity).save(convertedAddressEntity);
    const savedHeadDto: CreateAddressDto = this.addressAdapter.convertEntityToDto(savedAddressEntity);
    addressDtos.push(savedAddressEntity)
      console.log(savedAddressEntity,'saved');
    if (savedAddressEntity) {
      const presentValue = addressDto.addresserNameId;
      //generating resposnse
      const response =new CommonResponse(true,1,isUpdate? 'Address Updated Successfully':'Address created Successfully')
      const name=isUpdate?'updated':'created'
      const displayValue = isUpdate? 'Address Updated Successfully': 'Address Created Successfully'
      const userName = isUpdate? savedHeadDto.updatedUser :savedHeadDto.createdUser;
        console.log(response,'9999999999999999');
      return response;
    } else {
      throw new CommonResponse(false,11106,'Address saved but issue while transforming into DTO');
    }
  } catch (error) {
    return error;
  }
}

  async getAllAddress(): Promise<CommonResponse> {
    try {
      const query = `SELECT a.address_id AS addressId,addresser, CASE WHEN addresser = 'unit' THEN u.unit_name WHEN addresser = 'supplier' THEN s.supplier_name END AS addresserName, line_one AS lineOne, line_two AS lineTwo, city, dist, pin_code AS pinCode, state, country, a.created_at AS createdAt ,a.gst_no AS gstNo,a.cst_no AS cstNo , a.is_active AS isActive, a.addresser_name_id as addresserNameId
      FROM shahi_address a
      LEFT JOIN shahi_units u ON u.id = a.addresser_name_id AND a.addresser = 'unit'
      LEFT JOIN shahi_suppliers s ON s.supplier_id = a.addresser_name_id AND a.addresser = 'supplier'
      WHERE addresser IN ('unit', 'supplier')`;
      const data = await AppDataSource.query(query)
      return new CommonResponse(true, 111, 'data retried successfully', data)
    } catch (error) {
      console.log(error)
    }
  }

  async getAllAddressByUnit(req:UnitReq): Promise<CommonResponse> {
    try {
      const query = `SELECT a.address_id AS addressId,addresser, addresser_name_id,
      CASE WHEN addresser = 'unit' THEN u.unit_name END AS addresserName, line_one AS lineOne, line_two AS lineTwo, city, dist, pin_code AS pinCode,
       state, country, a.created_at AS createdAt ,a.gst_no AS gstNo,a.cst_no AS cstNo , a.is_active AS isActive, a.addresser_name_id AS addresserNameId
            FROM shahi_address a
            LEFT JOIN shahi_units u ON u.id = a.addresser_name_id AND a.addresser = 'unit'
            WHERE addresser = 'unit' AND a.addresser_name_id = '${req.unitId}'`;
      const data = await AppDataSource.query(query)
      return new CommonResponse(true, 111, 'data retried successfully', data)
    } catch (error) {
      console.log(error)
    }
  }
  async getAllToAddressByUnit(req:ToAddressReq): Promise<CommonResponse> {
    try {
      const query = `SELECT a.address_id AS addressId,addresser,a.addresser_name_id AS addresserNameId, CASE WHEN addresser = 'unit' THEN u.unit_name WHEN addresser = 'supplier' THEN s.supplier_name END AS addresserName, line_one AS lineOne, line_two AS lineTwo, city, dist, pin_code AS pinCode, state, country, a.created_at AS createdAt ,a.gst_no AS gstNo,a.cst_no AS cstNo , a.is_active AS isActive, a.addresser_name_id AS addresserNameId
      FROM shahi_address a
      LEFT JOIN shahi_units u ON u.id = a.addresser_name_id AND a.addresser = 'unit'
      LEFT JOIN shahi_suppliers s ON s.supplier_id = a.addresser_name_id AND a.addresser = 'supplier'
      WHERE addresser = '${req.addresser}' AND a.addresser_name_id = '${req.addresserNameId}'`;
      const data = await AppDataSource.query(query)
      return new CommonResponse(true, 111, 'data retried successfully', data)
    } catch (error) {
      console.log(error)
    }
  }

}