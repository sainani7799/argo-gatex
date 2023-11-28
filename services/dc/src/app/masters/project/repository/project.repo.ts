import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ProjectEntity } from "../entity/project.entity";


@Injectable()
export class ProjectRepository extends Repository<ProjectEntity>{
    constructor(private dataSource: DataSource) {
        super(ProjectEntity, dataSource.createEntityManager());
    }
}