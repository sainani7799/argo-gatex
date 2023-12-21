import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UnitEntity } from "../entity/unit.entity";

@Injectable()
export class UnitRepository extends Repository<UnitEntity>{
    constructor(private dataSource: DataSource) {
        super(UnitEntity, dataSource.createEntityManager());
    }
}