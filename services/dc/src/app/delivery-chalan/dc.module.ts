import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DcController } from "./dc.controller";
import { DcService } from "./dc.service";
import { DcEntityRepository } from "./repository/dc-repository";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { DcAdapter } from "./adapter/dc.adapter";

@Module({
    imports: [TypeOrmModule.forFeature([
    ])],
    controllers: [DcController],
    providers: [DcService,DcAdapter,DcEntityRepository,ApplicationExceptionHandler],
    exports: [DcService],
  })
  export class DcModule {}