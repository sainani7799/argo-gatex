import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { VehicleOTREntity } from '../entity/vehicle-otr.entity';

@Injectable()
export class VehicleOTRRepository extends Repository<VehicleOTREntity> {
    constructor(private dataSource: DataSource) {
        super(VehicleOTREntity, dataSource.createEntityManager());
    }
}