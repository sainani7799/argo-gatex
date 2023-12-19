import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { ItemEntityRepository } from "./repository/item.repository";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { itemsAdapter } from "./dto/item.adapter";

@Module({
    imports: [TypeOrmModule.forFeature([
      // UserEntity
    ])],
    controllers: [ItemController],
    providers: [ItemService,itemsAdapter,ItemEntityRepository,ApplicationExceptionHandler],
    exports: [ItemService],
  })
  export class ItemModule {}