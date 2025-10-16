import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VehicleController } from "./vehicle.controller";
import { VehicleService } from "./vehicle.service";
import { VehicleAdapter } from "./dto/vehicle.adapter";
import { VehicleRepository } from "./repository/vehicle.repository";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { VehicleEntity } from "./entity/vehicle.entity";


@Module({
    imports: [TypeOrmModule.forFeature([VehicleEntity
    ])],
    controllers: [VehicleController],
    providers: [VehicleService, VehicleAdapter, VehicleRepository, ApplicationExceptionHandler],
    exports: [VehicleService],
})
export class VehicleModule { }