import { Module } from "@nestjs/common";
import { AddressController } from "./address.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressService } from "./address.service";
import { AddressEntityRepository } from "./repository/address.repository";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { AddressAdapter } from "./dto/address.adapter";

@Module({
    imports: [TypeOrmModule.forFeature([
      // UserEntity
    ])],
    controllers: [AddressController],
    providers: [AddressService,AddressAdapter,AddressEntityRepository,ApplicationExceptionHandler],
    exports: [AddressService],
  })
  export class AddressModule {}