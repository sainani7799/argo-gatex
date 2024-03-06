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
    host: 'localhost',
    username: 'sql_gpdc_seplclo',
    password: 'thFFTBh2WrWkBWDC',
    database: 'sql_gpdc_seplclo',
    synchronize: false,
    logging:true,
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

