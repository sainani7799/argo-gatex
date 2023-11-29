import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WarehouseController } from "./warehouse.controller";
import { WarehouseService } from "./warehouse.service";
import { WarehouseEntityRepository } from "./repository/warehouse.repository";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";

@Module({
    imports: [TypeOrmModule.forFeature([
      // UserEntity
    ])],
    controllers: [WarehouseController],
    providers: [WarehouseService,WarehouseEntityRepository,ApplicationExceptionHandler],
    exports: [WarehouseService],
  })
  export class WarehouseModule {}