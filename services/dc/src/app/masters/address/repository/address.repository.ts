import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AddressEntity } from '../entity/address.entity';

@Injectable()
export class AddressEntityRepository extends Repository<AddressEntity>{
    
}