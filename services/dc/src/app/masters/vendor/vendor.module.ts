import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { VendorEntity } from "./entity/vendor.entity";
import { VendorService } from "./vendor.service";
import { VendorController } from "./vendor.controller";

@Module({

    imports: [TypeOrmModule.forFeature([VendorEntity])],
    controllers: [VendorController],
    providers: [VendorService,Repository],
  })
  export class VendorModule {}