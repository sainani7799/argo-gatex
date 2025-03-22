import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { EmailService, WhatsAppNotificationService } from "libs/shared-services";
import { UnitRepository } from "../masters/branch/repo/unit-repo";
import { DcAdapter } from "./adapter/dc.adapter";
import { DcController } from "./dc.controller";
import { DcService } from "./dc.service";
import { VehicleEntity } from "./entity/vehicle-en.entity";
import { VehicleINREntity } from "./entity/vehicle-inr.entity";
import { VehicleOTREntity } from "./entity/vehicle-otr.entity";
import { VehicleStateEntity } from "./entity/vehicle-state.entity";
import { DcItemEntityRepository } from "./repository/dc-items.repo";
import { DcEntityRepository } from "./repository/dc-repository";
import { MailerService } from "./send-mail";
import { VehicleINRRepository } from "./repository/vehicle-inr.repository";
import { VehicleRepository } from "./repository/vehicle.repository";
import { VehicleOTRRepository } from "./repository/vehicle-otr.repository";
import { VHRService } from "./vhr.service";
import { VHRController } from "./vhr.controller";

@Module({
  imports: [TypeOrmModule.forFeature([VehicleINREntity, VehicleOTREntity, VehicleEntity, VehicleStateEntity])],
  controllers: [DcController, VHRController],
  providers: [DcService, VHRService, DcAdapter, DcEntityRepository, VehicleINRRepository, VehicleOTRRepository, VehicleRepository, ApplicationExceptionHandler, UnitRepository, DcItemEntityRepository, MailerService, WhatsAppNotificationService, EmailService],
  exports: [DcService, VHRService],
})
export class DcModule { }
