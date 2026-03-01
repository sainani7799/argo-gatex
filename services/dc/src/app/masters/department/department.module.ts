import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { DepartmentAdapter } from './adapter/department-adapter';
import { DepartmentRepository } from './repo/department-repo';
import { DepartmentEntity } from './entity/department.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
        DepartmentEntity
    ]),
  ],
  providers : [DepartmentService,DepartmentRepository,DepartmentAdapter,],
  controllers :[DepartmentController]
})
export class DepartmentModule {}