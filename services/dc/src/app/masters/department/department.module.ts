import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { DepartmentAdapter } from './adapter/department-adapter';
import { DepartmentEntity } from './entity/department.entity'
import { DepartmentRepository } from './repo/department-repo';
@Module({

  imports: [TypeOrmModule.forFeature([
    // DepartmentEntity,DepartmentAdapter
  ])],
  controllers: [DepartmentController],
  providers: [DepartmentService,DepartmentAdapter,DepartmentRepository],
  exports : [DepartmentService]
})
export class DepartmentModule {}