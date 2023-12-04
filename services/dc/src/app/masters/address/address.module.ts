import { Module } from "@nestjs/common";
import { AddressController } from "./address.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressService } from "./address.service";
import { AddressEntityRepository } from "./repository/address.repository";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";

@Module({
    imports: [TypeOrmModule.forFeature([
      // UserEntity
    ])],
    controllers: [AddressController],
    providers: [AddressService,AddressEntityRepository,ApplicationExceptionHandler],
    exports: [AddressService],
  })
  export class AddressModule {}