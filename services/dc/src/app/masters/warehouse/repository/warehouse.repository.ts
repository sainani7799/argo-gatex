import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { WarehouseEntity } from '../entity/warehouse.entity';

@Injectable()
export class WarehouseEntityRepository extends Repository<WarehouseEntity>{
    constructor(private dataSource: DataSource) {
        super(WarehouseEntity, dataSource.createEntityManager());
    }  
}