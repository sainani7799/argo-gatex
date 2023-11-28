import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { VendorEntity } from "../entity/vendor.entity";


@Injectable()
export class VendorRepository extends Repository<VendorEntity>{
    constructor(private dataSource: DataSource) {
        super(VendorEntity, dataSource.createEntityManager());
    }
}