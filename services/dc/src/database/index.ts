import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmAsyncConfig } from "./type-orm-config/typeorm.config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
  ],
})
export class DatabaseModule {}