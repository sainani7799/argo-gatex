import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { ProjectEntity } from "./entity/project.entity";
import { ProjectService } from "./project.service ";
import { ProjectController } from "./project.controller";

@Module({

    imports: [TypeOrmModule.forFeature([ProjectEntity])],
    controllers: [ProjectController],
    providers: [ProjectService,Repository],
  })
  export class ProjectModule {}