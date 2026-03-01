import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { CommonResponse } from "@gatex/shared-models";
import { VehicleService } from "./vehicle.service";
import { VehicleDto } from "./dto/vehicle.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Vehicle')
@Controller("/vehicle-controller")
export class VehicleController {
    constructor(
        private readonly service: VehicleService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }


    @Post('createVehicle')
    async createVehicle(@Body() dto: any): Promise<CommonResponse> {
        try {
            return this.service.createVehicle(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponse, error)
        }
    }

    @Get('/getAllVehicle')
    async getAllVehicle(): Promise<CommonResponse> {
        try {
            return await this.service.getAllVehicle();
        } catch (error) {
            console.log(error, 'err')
            return this.applicationExceptionHandler.returnException(CommonResponse, error);
        }
    }


    @Get('/getInVehicle')
    async getInVehicle(): Promise<CommonResponse> {
        try {
            return await this.service.getInVehicle();
        } catch (error) {
            console.log(error, 'err')
            return this.applicationExceptionHandler.returnException(CommonResponse, error);
        }
    }



}