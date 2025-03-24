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
import { VehicleINRRepo } from "./repository/vehicle-inr.repo";
import { VehicleOTRRepo } from "./repository/vehicle-otr.repo";
import { VehicleENRepository } from "./repository/vehicle.repo";
import { VehicleStateRepository } from "./repository/vehicle-state.repo";

@Module({
  imports: [TypeOrmModule.forFeature([VehicleINREntity, VehicleOTREntity, VehicleEntity, VehicleStateEntity])],
  controllers: [DcController],
  providers: [DcService, DcAdapter, DcEntityRepository, ApplicationExceptionHandler, UnitRepository, DcItemEntityRepository, MailerService, WhatsAppNotificationService, EmailService,VehicleENRepository,VehicleStateRepository,VehicleINRRepo,VehicleOTRRepo],
  exports: [DcService],
})
export class DcModule { }
