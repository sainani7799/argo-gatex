import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entity/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleAdapter } from './role.adapter';
@Module({

  imports: [TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RoleController],
  providers: [RoleService,Repository,RoleAdapter],
})
export class RoleModule {}