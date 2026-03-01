import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ApprovedUserEntity } from '../entity/appUser.entity';

@Injectable()
export class ApprovedUserEntityRepository extends Repository<ApprovedUserEntity>{
    constructor(private dataSource: DataSource) {
        super(ApprovedUserEntity, dataSource.createEntityManager());
    }
}