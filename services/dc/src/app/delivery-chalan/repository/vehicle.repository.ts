import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { VehicleEntity } from '../entity/vehicle-en.entity';

@Injectable()
export class VehicleRepository extends Repository<VehicleEntity> {
    constructor(private dataSource: DataSource) {
        super(VehicleEntity, dataSource.createEntityManager());
    }
}