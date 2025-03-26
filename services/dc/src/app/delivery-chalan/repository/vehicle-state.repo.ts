import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VehicleStateEntity } from "../entity/vehicle-state.entity";

@Injectable()
export class VehicleStateRepository extends Repository<VehicleStateEntity> {
    constructor(@InjectRepository(VehicleStateEntity) private vehicleStateRepository: Repository<VehicleStateEntity>
    ) {
        super(vehicleStateRepository.target, vehicleStateRepository.manager, vehicleStateRepository.queryRunner);
    }

}