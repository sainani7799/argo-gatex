import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DcController } from "./dc.controller";
import { DcService } from "./dc.service";
import { DcEntityRepository } from "./repository/dc-repository";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { DcAdapter } from "./adapter/dc.adapter";
import { UnitRepository } from "../masters/branch/repo/unit-repo";
import { DcItemEntityRepository } from "./repository/dc-items.repo";
import { MailerService } from "./send-mail";
import { EmailService, WhatsAppNotificationService } from "libs/shared-services";
import { VehicleOTREntity } from "./entity/vehicle-otr.entity";
import { VehicleEntity } from "./entity/vehicle-en.entity";
import { VehicleStateEntity } from "./entity/vehicle-state.entity";

@Module({
    imports: [TypeOrmModule.forFeature([VehicleOTREntity,VehicleEntity,VehicleStateEntity])],
    controllers: [DcController],
    providers: [DcService,DcAdapter,DcEntityRepository,ApplicationExceptionHandler,UnitRepository,DcItemEntityRepository,MailerService,WhatsAppNotificationService,EmailService],
    exports: [DcService],
  })
  export class DcModule {}