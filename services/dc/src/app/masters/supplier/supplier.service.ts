import { Injectable } from "@nestjs/common";
import { SupplierEntityRepository } from "./repository/supplier.repository";
import { CommonResponse } from "libs/shared-models/src/common";
import { CreateSupplierDto } from "./dto/supplier.dto";
import { SupplierEntity } from "./entity/supplier.entity";
import { AppDataSource } from "../../app-data-source";

@Injectable()
export class SupplierService {
  constructor(
    // @InjectRepository(UserEntity)
    private SupplierRepo: SupplierEntityRepository,
    // userRepository: UserEntityRepository,
    // @InjectDataSource() private dataSource: DataSource
    
  ) { }

  async createSupplier(dto:CreateSupplierDto| CreateSupplierDto[]):Promise<CommonResponse>{
    const supplier = Array.isArray(dto) ? dto : [dto];
    try{
        for (const obj of supplier) {
            const existingRecord = await AppDataSource.getRepository(SupplierEntity).findOne({ where: { supplierName: obj.supplierName } });
      
            if (existingRecord) {
              return new CommonResponse(false, 0, "Supplier already existed", []);
            }else{
                for(const obj of supplier){
                    const entity = new SupplierEntity()
                    entity.supplierId = obj.supplierId;
                    entity.supplierName = obj.supplierName;
                    entity.supplierCode = obj.supplierCode;
                    entity.createdUser = obj.createdUser;
                    const create = await AppDataSource.getRepository(SupplierEntity).save(entity)
                    console.log(create)
                    return await new CommonResponse(true,111,'Supplier created successfully',create)
                }
            }
        }
    }catch (error){
         console.log(error)
    }
  }

  async getAllSuppliers():Promise<CommonResponse>{
    try{
      const supplierData = await AppDataSource.getRepository(SupplierEntity).find()
      return new CommonResponse(true,2222,'warehouse data retrieved successfully',supplierData)
    }catch(error){
      console.log(error)
    }
  }

}