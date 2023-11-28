import { DataSource } from "typeorm";
import { UserEntity } from "./user/entity/user.entity";
import { DesignationEntity } from "./masters/designation/entity/designation.entity";
import { EmployeeEntity } from "./masters/employees/entity/employee.entity";
import { RoleEntity } from "./masters/role/entity/role.entity";
import { DepartmentEntity } from "./masters/department/entity/department.entity";
import { UnitEntity } from "./masters/branch/entity/unit.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: '172.20.50.169',
    username: 'internal_apps',
    password: 'Schemax@2023',
    database: 'internal_apps',
    synchronize: false,
    logging:true,
    entities:[DepartmentEntity,UserEntity,EmployeeEntity,DesignationEntity,UnitEntity]
   
})

