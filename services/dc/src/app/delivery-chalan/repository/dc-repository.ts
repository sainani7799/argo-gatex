import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DcEntity } from '../entity/dc.entity';

@Injectable()
export class DcEntityRepository extends Repository<DcEntity>{
    
}