import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ItemEntity } from '../entity/item.entity';

@Injectable()
export class ItemEntityRepository extends Repository<ItemEntity>{
    constructor(private dataSource: DataSource) {
        super(ItemEntity, dataSource.createEntityManager());
    }  
}