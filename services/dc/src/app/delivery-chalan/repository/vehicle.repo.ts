import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VehicleEntity } from "../entity/vehicle-en.entity";

@Injectable()
export class VehicleENRepository extends Repository<VehicleEntity> {
    constructor(@InjectRepository(VehicleEntity) private vehicleRepository: Repository<VehicleEntity>
    ) {
        super(vehicleRepository.target, vehicleRepository.manager, vehicleRepository.queryRunner);
    }

}