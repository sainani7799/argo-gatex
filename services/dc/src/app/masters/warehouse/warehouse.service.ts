import { Injectable } from "@nestjs/common";
import { WarehouseEntityRepository } from "./repository/warehouse.repository";
import { CommonResponse } from "@gatex/shared-models";
import { CreateWarehouseDto } from "./dto/warehouse.dto";
import { WarehouseEntity } from "./entity/warehouse.entity";
import { UnitReq } from "@gatex/shared-models";
import { WarehouseAdapter } from "./dto/warehouse.adapter";
import { Raw } from "typeorm";

@Injectable()
export class WarehouseService {
  constructor(
    private warehouseRepo: WarehouseEntityRepository,
    private warehouseAdapter: WarehouseAdapter,

  ) { }
  
  async getWarehouseWithoutRelations(unitId: number): Promise<WarehouseEntity> {
    const warehouseResponse = await this.warehouseRepo.findOne({
      where: {unitId },
    });
    if (warehouseResponse) {
      return warehouseResponse;
    }
    else {
      return null;
    }
  }

  async createWarehouse(warehouseDto: CreateWarehouseDto, isUpdate: boolean): Promise<CommonResponse> {
    console.log('isUpdate============', isUpdate)
    try {
      let previousValue
      const warehouseDtos: CreateWarehouseDto[] = [];

      if (!isUpdate) {

        const warehouseEntity = await this.getWarehouseWithoutRelations(warehouseDto.unitId);
        if (warehouseEntity) {
          console.log(warehouseEntity, '------')
          throw new CommonResponse(false, 11104, 'warehouse Entity already exists in this unit');
        }
      }
      else {
        const certificatePrevious = await this.warehouseRepo.findOne({
          where: {unitId: warehouseDto.unitId },
        }); 
        if (certificatePrevious) {
          previousValue = { unitId: certificatePrevious.unitId };
          console.log(previousValue, 'previousValue');

          const warehouseEntity = await this.getWarehouseWithoutRelations(
            warehouseDto.unitId
          );

          console.log(warehouseEntity, 'warehouseEntity');

          // Compare individual properties directly
          if (warehouseEntity &&
            (warehouseEntity.unitId !== previousValue.unitId)
          ) {
            throw new CommonResponse(false, 11104, 'warehouse already exists in this unit');
          }
        }
      }
      const convertedWarehouseEntity: WarehouseEntity = this.warehouseAdapter.convertDtoToEntity(warehouseDto, isUpdate);

      console.log(convertedWarehouseEntity);
      const savedWarehouseEntity: WarehouseEntity = await this.warehouseRepo.save(convertedWarehouseEntity);
      const savedHeadDto: CreateWarehouseDto = this.warehouseAdapter.convertEntityToDto(savedWarehouseEntity);
      warehouseDtos.push(savedWarehouseEntity)
      console.log(savedWarehouseEntity, 'saved');
      if (savedWarehouseEntity) {
        const presentValue = warehouseDto.unitId;
        //generating resposnse
        const response = new CommonResponse(true, 1, isUpdate ? 'Warehouse Updated Successfully' : 'Warehouse created Successfully')
        const name = isUpdate ? 'updated' : 'created'
        const displayValue = isUpdate ? 'Warehouse Updated Successfully' : 'Warehouse Created Successfully'
        const userName = isUpdate ? savedHeadDto.updatedUser : savedHeadDto.createdUser;
        console.log(response, 'ware res');
        return response;
      } else {
        throw new CommonResponse(false, 11106, 'Warehouse saved but issue while transforming into DTO');
      }
    } catch (error) {
      return error;
    }
  }



  async getAllWarehouses(): Promise<CommonResponse> {
    try {
      const query = `select w.warehouse_id as warehouseId, w.warehouse_name as warehouseName , w.unit_id  AS unitId,u.unit_name as unitName, created_user as createdUser,updated_user as updatedUser, u.is_active AS isActive from shahi_warehouse w
      left join shahi_units u on u.id = w.unit_id`
      const warehouseData = await this.warehouseRepo.query(query)
      return new CommonResponse(true, 2222, 'warehouse data retrieved successfully', warehouseData)
    } catch (error) {
      console.log(error)
    }
  }

  async getAllWarehousesByUnit(req: UnitReq): Promise<CommonResponse> {
    try {
      const warehouseData = await this.warehouseRepo.find({ where: { unitId: req.unitId } })
      return new CommonResponse(true, 2222, 'warehouse data retrieved successfully', warehouseData)
    } catch (error) {
      console.log(error)
    }
  }
  async activateOrDeactivateWarehouse(req: CreateWarehouseDto): Promise<CommonResponse> {
    console.log(req,'---------unit req')
    try {
      const warehouseExists = await this.getWarehouseById(req.warehouseId);
      if (warehouseExists) {
        if (!warehouseExists) {
          throw new CommonResponse(false, 10113, 'Someone updated the current Warehouse information.Refresh and try again');
        } else {

          const warehouseStatus = await this.warehouseRepo.update(
            { warehouseId: req.warehouseId },
            { isActive: req.isActive, updatedUser: req.updatedUser });

          if (warehouseExists.isActive) {
            if (warehouseStatus.affected) {
              const ProfitResponse: CommonResponse = new CommonResponse(true, 10115, 'warehouse  is de-activated successfully');
              return ProfitResponse;
            } else {
              throw new CommonResponse(false, 10111, 'warehouse is already deactivated');
            }
          } else {
            if (warehouseStatus.affected) {
              const ProfitResponse: CommonResponse = new CommonResponse(true, 10114, 'warehouse is activated successfully');
              return ProfitResponse;
            } else {
              throw new CommonResponse(false, 10112, 'warehouse  is already  activated');
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
  async getWarehouseById(warehouseId: number): Promise<WarehouseEntity> {
    const Response = await this.warehouseRepo.findOne({
      where: { warehouseId: warehouseId },
    });
    if (Response) {
      return Response;
    } else {
      return null;
    }
  }

}