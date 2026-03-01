import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DcEntity } from '../entity/dc.entity';

@Injectable()
export class DcEntityRepository extends Repository<DcEntity>{
    constructor(private dataSource: DataSource) {
        super(DcEntity, dataSource.createEntityManager());
    }
}