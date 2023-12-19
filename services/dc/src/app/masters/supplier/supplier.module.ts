import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SupplierController } from "./supplier.controller";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { SupplierService } from "./supplier.service";
import { SupplierEntityRepository } from "./repository/supplier.repository";
import { SupplierAdapter } from "./dto/buyer.adapter";

@Module({
    imports: [TypeOrmModule.forFeature([
      // UserEntity
    ])],
    controllers: [SupplierController],
    providers: [SupplierService,SupplierAdapter,SupplierEntityRepository,ApplicationExceptionHandler],
    exports: [SupplierService],
  })
  export class SupplierModule {}