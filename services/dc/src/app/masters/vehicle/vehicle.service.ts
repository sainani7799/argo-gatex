import { Injectable } from "@nestjs/common";
import { CommonResponse } from "@gatex/shared-models";
import { UnitReq } from "@gatex/shared-models";
import { Raw } from "typeorm";
import { VehicleRepository } from "./repository/vehicle.repository";
import { VehicleAdapter } from "./dto/vehicle.adapter";
import { VehicleEntity } from "./entity/vehicle.entity";
import { VehicleDto } from "./dto/vehicle.dto";
import { ErrorResponse } from "libs/backend-utils/src/lib/libs/global-res-object";

@Injectable()
export class VehicleService {
    constructor(
        private vehicleRepo: VehicleRepository,
        private vehicleAdapter: VehicleAdapter,

    ) { }


    async createVehicle(dto: any): Promise<CommonResponse> {
        try {
            let internalMessage = dto.vehicleId ? "Updated Successfully" : "Created Successfully";
            const convertDto = this.vehicleAdapter.convertDtoToEntity(dto);
            await this.vehicleRepo.save(convertDto);
            return new CommonResponse(true, 65152, internalMessage);
        }
        catch (error) {
            throw new ErrorResponse(5416, error.message);
        }
    }


    async getAllVehicle(): Promise<CommonResponse> {
        try {
            const query = `SELECT * FROM vehicle  `
            const vehicleData = await this.vehicleRepo.query(query)
            return new CommonResponse(true, 2222, 'vehicle data retrieved successfully', vehicleData)
        } catch (error) {
            console.log(error)
        }
    }


    async getInVehicle(): Promise<CommonResponse> {
        try {
            const query = `SELECT * FROM vehicle WHERE status = 'vehicle in'`;
            const vehicleData = await this.vehicleRepo.query(query);

            return new CommonResponse(true, 2222, 'Vehicle data retrieved successfully', vehicleData);
        } catch (error) {
            console.error('Error fetching vehicle data:', error);
            throw new ErrorResponse(5416, error.message);
        }
    }


}