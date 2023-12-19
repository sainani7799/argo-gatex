import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WarehouseController } from "./warehouse.controller";
import { WarehouseService } from "./warehouse.service";
import { WarehouseEntityRepository } from "./repository/warehouse.repository";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { WarehouseAdapter } from "./dto/warehouse.adapter";

@Module({
    imports: [TypeOrmModule.forFeature([
      // UserEntity
    ])],
    controllers: [WarehouseController],
    providers: [WarehouseService,WarehouseAdapter,WarehouseEntityRepository,ApplicationExceptionHandler],
    exports: [WarehouseService],
  })
  export class WarehouseModule {}