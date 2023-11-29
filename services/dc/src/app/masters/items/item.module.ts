import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { ItemEntityRepository } from "./repository/item.repository";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";

@Module({
    imports: [TypeOrmModule.forFeature([
      // UserEntity
    ])],
    controllers: [ItemController],
    providers: [ItemService,ItemEntityRepository,ApplicationExceptionHandler],
    exports: [ItemService],
  })
  export class ItemModule {}