import { Injectable } from "@nestjs/common";
import { AddressEntityRepository } from "./repository/address.repository";
import { CreateAddressDto } from "./dto/address.dto";
import { CommonResponse } from "libs/shared-models/src/common";
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

  async getAddressWithoutRelations(addresserNameId: number,addresser:string): Promise<AddressEntity> {
    const addressResponse = await this.addressRepo.findOne({
      where: { addresserNameId: Raw(alias => `addresser_name_Id = '${addresserNameId}'`),addresser:addresser },
    });
    if (addressResponse) {
      return addressResponse;
    }
    else {
      return null;
    }
  }


  async createAddress(addressDto: CreateAddressDto, isUpdate: boolean): Promise<CommonResponse> {
    try {
      let previousValue
      const addressDtos: CreateAddressDto[] = [];

      if (!isUpdate) {

        const addressEntity = await this.getAddressWithoutRelations(addressDto.addresserNameId,addressDto.addresser);
        console.log(addressEntity)
        if (addressEntity) {
          throw new CommonResponse(false, 11104, 'Address already exists');
        }
      }
      // else {
      //   const certificatePrevious = await this.addressRepo.findOne({ where: { addressId: addressDto.addressId } })
      //   previousValue = (certificatePrevious.addresserNameId)
      //   const addressEntity = await this.getAddressWithoutRelations(addressDto.addresserNameId,addressDto.addresser);
      //   if (addressEntity) {
      //     if (addressEntity.addresserNameId != addressDto.addresserNameId) {
      //       throw new CommonResponse(false, 11104, 'Address already exists');
      //     }
      //   }
      // }
      const convertedAddressEntity: AddressEntity = this.addressAdapter.convertDtoToEntity(addressDto, isUpdate);

      const savedAddressEntity: AddressEntity = await this.addressRepo.save(convertedAddressEntity);
      const savedHeadDto: CreateAddressDto = this.addressAdapter.convertEntityToDto(savedAddressEntity);
      addressDtos.push(savedAddressEntity)
      if (savedAddressEntity) {
        //generating resposnse
        const response = new CommonResponse(true, 1, isUpdate ? 'Address Updated Successfully' : 'Address created Successfully')
        return response;
      } else {
        throw new CommonResponse(false, 11106, 'Address saved but issue while transforming into DTO');
      }
    } catch (error) {
      return error;
    }
  }

  async getAllAddress(): Promise<CommonResponse> {

    try {

      const query = `SELECT a.address_id AS addressId,addresser, CASE WHEN addresser = 'unit' THEN u.unit_name WHEN addresser IN ('SUPPLIER', 'BUYER')  THEN s.supplier_name END AS addresserName, line_one AS lineOne, line_two AS lineTwo, city, dist, pin_code AS pinCode, state, country, a.created_at AS createdAt ,a.gst_no AS gstNo,a.cst_no AS cstNo , a.is_active AS isActive, a.addresser_name_id as addresserNameId
      FROM shahi_address a
      LEFT JOIN shahi_units u ON u.id = a.addresser_name_id AND a.addresser = 'unit'
      LEFT JOIN shahi_suppliers s ON (s.supplier_id = a.addresser_name_id AND a.addresser IN ('SUPPLIER', 'BUYER')) `;
      const data = await this.addressRepo.query(query)
      return new CommonResponse(true, 111, 'data retried successfully', data)
    } catch (error) {
      console.log(error)
    }
  }

  async getAllAddressByUnit(req: UnitReq): Promise<CommonResponse> {
    try {
      const query = `SELECT a.address_id AS addressId,addresser, addresser_name_id,
      CASE WHEN addresser = 'unit' THEN u.unit_name END AS addresserName, line_one AS lineOne, line_two AS lineTwo, city, dist, pin_code AS pinCode,
       state, country, a.created_at AS createdAt ,a.gst_no AS gstNo,a.cst_no AS cstNo , a.is_active AS isActive, a.addresser_name_id AS addresserNameId
            FROM shahi_address a
            LEFT JOIN shahi_units u ON u.id = a.addresser_name_id AND a.addresser = 'unit'
            WHERE addresser = 'unit' AND a.addresser_name_id = ${req.unitId}`;
      const data = await this.addressRepo.query(query)
      return new CommonResponse(true, 111, 'data retried successfully', data)
    } catch (error) {
      console.log(error)
    }
  }
  async getAllToAddressByUnit(req: ToAddressReq): Promise<CommonResponse> {
    try {
      const query = `SELECT a.address_id AS addressId,addresser,a.addresser_name_id AS addresserNameId, CASE WHEN addresser = 'unit' THEN u.unit_name WHEN addresser = 'supplier' THEN s.supplier_name WHEN addresser = 'buyer' THEN b.supplier_name END AS addresserName, line_one AS lineOne, line_two AS lineTwo, city, dist, pin_code AS pinCode, state, country, a.created_at AS createdAt ,a.gst_no AS gstNo,a.cst_no AS cstNo , a.is_active AS isActive, a.addresser_name_id AS addresserNameId
      FROM shahi_address a
      LEFT JOIN shahi_units u ON u.id = a.addresser_name_id AND a.addresser = 'unit'
      LEFT JOIN shahi_suppliers s ON s.supplier_id = a.addresser_name_id AND a.addresser = 'supplier'
      LEFT JOIN shahi_suppliers b ON b.supplier_id = a.addresser_name_id AND a.addresser = 'buyer'
      WHERE addresser = '${req.addresser}' AND a.addresser_name_id = '${req.addresserNameId}'`;
      const data = await this.addressRepo.query(query)
      return new CommonResponse(true, 111, 'data retried successfully', data)
    } catch (error) {
      console.log(error)
    }
  }
  async activateOrDeactivateAddress(req: CreateAddressDto): Promise<CommonResponse> {
    try {
      const addressExists = await this.getAddressById(req.addressId);
      if (addressExists) {
        if (!addressExists) {
          throw new CommonResponse(false, 10113, 'Someone updated the current Address information.Refresh and try again');
        } else {

          const addressStatus = await this.addressRepo.update(
            { addressId: req.addressId },
            { isActive: req.isActive, updatedUser: req.updatedUser });

          if (addressExists.isActive) {
            if (addressStatus.affected) {
              const ProfitResponse: CommonResponse = new CommonResponse(true, 10115, 'Address is de-activated successfully');
              return ProfitResponse;
            } else {
              throw new CommonResponse(false, 10111, 'Address is already deactivated');
            }
          } else {
            if (addressStatus.affected) {
              const ProfitResponse: CommonResponse = new CommonResponse(true, 10114, 'Address is activated successfully');
              return ProfitResponse;
            } else {
              throw new CommonResponse(false, 10112, 'Address is already  activated');
            }
          }
        }
      } else {
        throw new CommonResponse(false, 99998, 'No Records Found');
      }
    } catch (err) {
      return err;
    }
  }
  async getAddressById(addressId: number): Promise<AddressEntity> {
    const Response = await this.addressRepo.findOne({
      where: { addressId: addressId },
    });
    if (Response) {
      return Response;
    } else {
      return null;
    }
  }

}