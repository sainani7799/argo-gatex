import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ItemEntity } from '../entity/item.entity';

@Injectable()
export class ItemEntityRepository extends Repository<ItemEntity>{
    
}