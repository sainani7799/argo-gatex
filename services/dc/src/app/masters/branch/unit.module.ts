
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { UnitAdapter } from './adapter/branch-adapter';
import { UnitRepository } from './repo/unit-repo';

@Module({
  imports: [TypeOrmModule.forFeature([
    // UnitEntity,UnitAdapter
  ])],
  controllers: [UnitController],
  providers: [UnitService,UnitAdapter,UnitRepository],
  exports: [UnitService],
})
export class UnitModule {}