import { DataSource, DataSourceOptions } from "typeorm";
import { UserEntity } from "./user/entity/user.entity";
import { DesignationEntity } from "./masters/designation/entity/designation.entity";
import { EmployeeEntity } from "./masters/employees/entity/employee.entity";
import { RoleEntity } from "./masters/role/entity/role.entity";
import { DepartmentEntity } from "./masters/department/entity/department.entity";
import { UnitEntity } from "./masters/branch/entity/unit.entity";
import { WarehouseEntity } from "./masters/warehouse/entity/warehouse.entity";
import { SupplierEntity } from "./masters/supplier/entity/supplier.entity";
import { ItemEntity } from "./masters/items/entity/item.entity";
import { AddressEntity } from "./masters/address/entity/address.entity";
import { ApprovedUserEntity } from "./masters/approved/entity/appUser.entity";
import { DcEntity } from "./delivery-chalan/entity/dc.entity";
import { DcItemEntity } from "./delivery-chalan/entity/dc-items.entity";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: DataSourceOptions ={
    type: "mysql",
    timezone: 'Z',
    host: process.env.APP_DB_HOST || '64.227.137.119',
    username: process.env.APP_DB_USERNAME || 'xpparel_qa_user',
    password: process.env.APP_DB_PASSWORD || 'Xpparel_qa@123',
    database: process.env.APP_DB_DATABASE || 'gatex_sq',
    port: parseInt(process.env.APP_DB_PORT || '3306', 10),
    synchronize: false,
    logging: process.env.APP_DB_LOGGING === 'true' || true,
    extra :{
       connectionLimit: parseInt(process.env.APP_DB_CONNECTION_LIMIT || '20', 10)
    },
    entities:[DepartmentEntity,UserEntity,EmployeeEntity,DesignationEntity,UnitEntity,WarehouseEntity,SupplierEntity,ItemEntity,AddressEntity,ApprovedUserEntity,DcEntity,DcItemEntity,RoleEntity]
}
export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      ...typeOrmConfig,
      synchronize: false,
      logging: true,
      autoLoadEntities: true
    }
  },

}

