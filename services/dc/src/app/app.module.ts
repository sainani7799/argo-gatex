import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartmentModule } from './masters/department/department.module';
import { DesignationModule } from './masters/designation/designation.module';
import { EmployeeModule } from './masters/employees/employee.module';
import { UserModule } from './user/user.module';
import { UnitModule } from './masters/branch/unit.module';
import { SectionsEntity } from './masters/department/entity/section.entity';
import { WarehouseModule } from './masters/warehouse/warehouse.module';
import { SupplierModule } from './masters/supplier/supplier.module';
import { ItemModule } from './masters/items/item.module';
import { AddressModule } from './masters/address/address.module';
import { ApprovedUserModule } from './masters/approved/approval-user.module';
import { DcModule } from './delivery-chalan/dc.module';
import { DatabaseModule } from './app.datasourse-db-module';
import { RoleModule } from './masters/role/role.module';
import { BuyerTeamModule } from './masters/buyer_team/buyer_team.module';

@Module({
  imports: [DatabaseModule,DepartmentModule, EmployeeModule, UserModule, DesignationModule, UnitModule, SectionsEntity,WarehouseModule,SupplierModule,ItemModule,AddressModule,ApprovedUserModule,DcModule,RoleModule,BuyerTeamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
