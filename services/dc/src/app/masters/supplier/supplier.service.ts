import { Injectable } from "@nestjs/common";
import { SupplierEntityRepository } from "./repository/supplier.repository";
import { CommonResponse } from "@gatex/shared-models";
import { CreateSupplierDto } from "./dto/supplier.dto";
import { SupplierEntity } from "./entity/supplier.entity";
import { SupplierAdapter } from "./dto/buyer.adapter";

@Injectable()
export class SupplierService {
  constructor(
    private supplierRepo: SupplierEntityRepository,
    private supplierAdapter: SupplierAdapter,

  ) { }


  async getSupplierWithoutRelations(supplierCode: string): Promise<SupplierEntity> {
    const supplierResponse = await this.supplierRepo.findOne({
      where: { supplierCode },
    });
    if (supplierResponse) {
      return supplierResponse;
    }
    else {
      return null;
    }
  }


  async createSupplier(supplierDto: CreateSupplierDto, isUpdate: boolean): Promise<CommonResponse> {
    console.log('isUpdate============', isUpdate)
    try {
      let previousValue
      const suppliersDtos: CreateSupplierDto[] = [];

      if (!isUpdate) {

        const supplierEntity = await this.getSupplierWithoutRelations(supplierDto.supplierCode);
        if (supplierEntity) {
          console.log(supplierEntity, '------')
          throw new CommonResponse(false, 11104, 'supplier Entity already exists');
        }
      }
      else {
        const certificatePrevious = await this.supplierRepo.findOne({ where: { supplierCode: supplierDto.supplierCode } })
        previousValue = (certificatePrevious.supplierCode)
        const supplierEntity = await this.getSupplierWithoutRelations(supplierDto.supplierCode);
        if (supplierEntity) {
          if (supplierEntity.supplierCode != supplierDto.supplierCode) {
            throw new CommonResponse(false, 11104, 'supplier already exists');
          }
        }
      }
      const convertedSupplierEntity: SupplierEntity = this.supplierAdapter.convertDtoToEntity(supplierDto, isUpdate);

      console.log(convertedSupplierEntity);
      const savedSupplierEntity: SupplierEntity = await this.supplierRepo.save(convertedSupplierEntity);
      const savedHeadDto: CreateSupplierDto = this.supplierAdapter.convertEntityToDto(savedSupplierEntity);
      suppliersDtos.push(savedSupplierEntity)
      console.log(savedSupplierEntity, 'saved');
      if (savedSupplierEntity) {
        const presentValue = supplierDto.supplierCode;
        const response = new CommonResponse(true, 1, isUpdate ? 'supplier Updated Successfully' : 'supplier created Successfully')
        const name = isUpdate ? 'updated' : 'created'
        const displayValue = isUpdate ? 'supplier Updated Successfully' : 'supplier Created Successfully'
        const userName = isUpdate ? savedHeadDto.updatedUser : savedHeadDto.createdUser;
        console.log(response, 'response');
        return response;
      } else {
        throw new CommonResponse(false, 11106, 'supplier saved but issue while transforming into DTO');
      }
    } catch (error) {
      return error;
    }
  }

  async getAllSuppliers(): Promise<CommonResponse> {
    try {
      const supplierData = await this.supplierRepo.find()
      return new CommonResponse(true, 2222, 'warehouse data retrieved successfully', supplierData)
    } catch (error) {
      console.log(error)
    }
  }

  async activateOrDeactivateSupplier(req: CreateSupplierDto): Promise<CommonResponse> {
    try {
        const supplierExists = await this.getSuppliersById(req.supplierId);
        if (supplierExists) {
            if (!supplierExists) {
                throw new CommonResponse(false, 10113, 'Someone updated the current Supplier information.Refresh and try again');
            } else {

                const supplierStatus = await this.supplierRepo.update(
                    { supplierId: req.supplierId },
                    { isActive: req.isActive, updatedUser: req.updatedUser });

                if (supplierExists.isActive) {
                    if (supplierStatus.affected) {
                        const supplierResponse: CommonResponse = new CommonResponse(true, 10115, 'supplier is de-activated successfully');
                        return supplierResponse;
                    } else {
                        throw new CommonResponse(false, 10111, 'supplier is already deactivated');
                    }
                } else {
                    if (supplierStatus.affected) {
                        const supplierResponse: CommonResponse = new CommonResponse(true, 10114, 'supplier is activated successfully');
                        return supplierResponse;
                    } else {
                        throw new CommonResponse(false, 10112, 'Supplier is already  activated');
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

async getSuppliersById(supplierId: number): Promise<SupplierEntity> {
    const Response = await this.supplierRepo.findOne({
        where: { supplierId: supplierId },
    });
    if (Response) {
        return Response;
    } else {
        return null;
    }
}


}