import { Injectable } from "@nestjs/common";
import { WarehouseEntityRepository } from "./repository/warehouse.repository";
import { CommonResponse } from "libs/shared-models/src/common";
import { CreateWarehouseDto } from "./dto/warehouse.dto";
import { WarehouseEntity } from "./entity/warehouse.entity";
import { AppDataSource } from "../../app-data-source";
import { UnitReq } from "libs/shared-models";

@Injectable()
export class WarehouseService {
  constructor(
    // @InjectRepository(UserEntity)
    private warehouseRepo: WarehouseEntityRepository,
    // userRepository: UserEntityRepository,
    // @InjectDataSource() private dataSource: DataSource
    
  ) { }

  async createWarehouse(dto:CreateWarehouseDto[]):Promise<CommonResponse>{
    try{
        for (const obj of dto) {
            const existingRecord = await AppDataSource.getRepository(WarehouseEntity).findOne({ where: {unitId:obj.unitId , warehouseName: obj.warehouseName } });
      
            if (existingRecord) {
              return new CommonResponse(false, 0, "Warehouse already existed in this unit", []);
            }else{
                for(const obj of dto){
                    const entity = new WarehouseEntity()
                    entity.warehouseId = obj.warehouseId;
                    entity.warehouseName = obj.warehouseName;
                    entity.unitId = obj.unitId;
                    entity.createdUser = obj.createdUser;
                    const create = await AppDataSource.getRepository(WarehouseEntity).save(entity)
                    console.log(create)
                    return await new CommonResponse(true,111,'Warehouse created successfully',create)
                    
                }
            }
        }
    }catch (error){
         console.log(error)
    }
  }

  async getAllWarehouses():Promise<CommonResponse>{
    try{
      const warehouseData = await AppDataSource.getRepository(WarehouseEntity).find()
      return new CommonResponse(true,2222,'warehouse data retrieved successfully',warehouseData)
    }catch(error){
      console.log(error)
    }
  }

  async getAllWarehousesByUnit(req:UnitReq):Promise<CommonResponse>{
    try{
      const warehouseData = await AppDataSource.getRepository(WarehouseEntity).find({where:{unitId:req.unitId} })
      return new CommonResponse(true,2222,'warehouse data retrieved successfully',warehouseData)
    }catch(error){
      console.log(error)
    }
  }

}