import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SupplierEntity } from '../entity/supplier.entity';

@Injectable()
export class SupplierEntityRepository extends Repository<SupplierEntity>{
    
}