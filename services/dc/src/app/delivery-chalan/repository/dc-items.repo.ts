import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DcEntity } from '../entity/dc.entity';
import { DcItemEntity } from '../entity/dc-items.entity';

@Injectable()
export class DcItemEntityRepository extends Repository<DcItemEntity>{
    constructor(private dataSource: DataSource) {
        super(DcItemEntity, dataSource.createEntityManager());
    }
}