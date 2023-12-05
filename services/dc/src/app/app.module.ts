import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartmentModule } from './masters/department/department.module';
import { DesignationModule } from './masters/designation/designation.module';
import { EmployeeModule } from './masters/employees/employee.module';
import { UserModule } from './user/user.module';
import { AppDataSource } from './app-data-source';
import { DataSource } from 'typeorm';
import { UnitModule } from './masters/branch/unit.module';
import { SectionsEntity } from './masters/department/entity/section.entity';
import { WarehouseModule } from './masters/warehouse/warehouse.module';
import { SupplierModule } from './masters/supplier/supplier.module';
import { ItemModule } from './masters/items/item.module';
import { AddressModule } from './masters/address/address.module';
import { ApprovedUserModule } from './masters/approved/approval-user.module';

@Module({
  imports: [DepartmentModule, EmployeeModule, UserModule, DesignationModule, UnitModule, SectionsEntity,WarehouseModule,SupplierModule,ItemModule,AddressModule,ApprovedUserModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: DataSource,
    useFactory: async () => {

      await AppDataSource.initialize().then(() => {
        console.log('Data Source 1 has been initialized!');
      }).catch((err) => {
        console.error('Error during Data Source 1 initialization', err);
      });
      return [AppDataSource];

    },
  },],
})
export class AppModule { }
