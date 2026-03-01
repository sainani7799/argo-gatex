import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DesignationEntity } from "./entity/designation.entity";
import { DesignationController } from "./designation.controller";
import { DesignationService } from "./designation.service";
import { DesignationRepository } from "./repository/designation.repo";

@Module({

    imports: [TypeOrmModule.forFeature([
      // DesignationEntity
    ])],
    controllers: [DesignationController],
    providers: [DesignationService,DesignationRepository],
  })
  export class DesignationModule {}