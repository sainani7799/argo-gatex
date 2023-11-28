import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { ProjectEntity } from "./entity/project.entity";

@Injectable()
export class ProjectService {

    constructor(
        @InjectRepository(ProjectEntity)
        private repository: Repository<ProjectEntity>,
      ) { }

      async getAllProjects(): Promise<any> {
        const data = await this.repository.find();
        if (data.length === 0) {
          console.log('ppp')
        }
        return data
      }
}