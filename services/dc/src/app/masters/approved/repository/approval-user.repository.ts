import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ApprovedUserEntity } from '../entity/appUser.entity';

@Injectable()
export class ApprovedUserEntityRepository extends Repository<ApprovedUserEntity>{
    
}