import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { DepartmentEntity } from "../entity/department.entity";

@Injectable()
export class DepartmentRepository extends Repository<DepartmentEntity>{
    constructor(private dataSource: DataSource) {
        super(DepartmentEntity, dataSource.createEntityManager());
    }
}