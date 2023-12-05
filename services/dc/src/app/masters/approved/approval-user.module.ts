import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApprovalUSerController } from "./approval-user.controller";
import { ApprovedUserService } from "./approval-user.service";
import { ApprovedUserEntityRepository } from "./repository/approval-user.repository";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";

@Module({
    imports: [TypeOrmModule.forFeature([
      // UserEntity
    ])],
    controllers: [ApprovalUSerController],
    providers: [ApprovedUserService,ApprovedUserEntityRepository,ApplicationExceptionHandler],
    exports: [ApprovedUserService],
  })
  export class ApprovedUserModule {}