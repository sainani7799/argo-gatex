import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WarehouseEntity } from '../entity/warehouse.entity';

@Injectable()
export class WarehouseEntityRepository extends Repository<WarehouseEntity>{
    
}