import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { VehicleINREntity } from '../entity/vehicle-inr.entity';
import { CommonRequestAttrs } from 'libs/shared-models/src/common';
import { VehicleEntity } from '../entity/vehicle-en.entity';
import { VRStatusDTO } from '../dto/vr-status-req.dto';

@Injectable()
export class VehicleINRRepository extends Repository<VehicleINREntity> {
    constructor(private dataSource: DataSource) {
        super(VehicleINREntity, dataSource.createEntityManager());
    }

    async getVehicleNotAssignedVINRRequestIds(req: CommonRequestAttrs): Promise<number[]> {
        const data = await this.createQueryBuilder('vinr')
            .select('GROUP_CONCAT(vinr.ref_id) as vehicleINRIds')
            .leftJoin(VehicleEntity, 'vehicle', 'vehicle.vinr_id = vinr.id')
            // .where(`vinr.unit_code = :unitCode and vinr.company_code = :companyCode`, { unitCode: req.unitCode, companyCode: req.companyCode })
            .where('vehicle.id is null')
            .getRawOne();
        return data.vehicleINRIds.split(',');
    }

    async getRefIdsByStatus(req: VRStatusDTO): Promise<number[]> {
        const data = await this.createQueryBuilder('vinr')
            .select('GROUP_CONCAT(distinct(vinr.ref_id)) as vehicleINRIds')
            .leftJoin(VehicleEntity, 'vehicle', 'vehicle.vinr_id = vinr.id')
            .where('vehicle.id is not null')
            .andWhere(`vehicle.vState in (${req.status.join(',')}) and vinr.from_type = ${req.fromType}`)
            .getRawOne();
        return data.vehicleINRIds.split(',');
    }
}