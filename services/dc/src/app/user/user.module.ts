import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserManagementController } from "./user.controller";
import { UserMangementService } from "./user.service";
import { UserEntityRepository } from "./repository/user-repository";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";


@Module({
    imports: [TypeOrmModule.forFeature([
      // UserEntity
    ])],
    controllers: [UserManagementController],
    providers: [UserMangementService,UserEntityRepository,ApplicationExceptionHandler],
    exports: [UserMangementService],
  })
  export class UserModule {}