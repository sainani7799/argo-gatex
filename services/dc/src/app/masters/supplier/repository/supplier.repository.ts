import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SupplierEntity } from '../entity/supplier.entity';

@Injectable()
export class SupplierEntityRepository extends Repository<SupplierEntity>{
    constructor(private dataSource: DataSource) {
        super(SupplierEntity, dataSource.createEntityManager());
    }
}