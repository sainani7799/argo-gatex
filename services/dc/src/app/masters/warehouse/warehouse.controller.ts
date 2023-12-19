import { Body, Controller, Get, Post } from "@nestjs/common";
import { WarehouseService } from "./warehouse.service";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { CommonResponse } from "libs/shared-models/src/common";
import { CreateWarehouseDto } from "./dto/warehouse.dto";
import { UnitReq } from "libs/shared-models";

@Controller("/warehouse-controller")
export class WarehouseController {
  constructor(
    private readonly service: WarehouseService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }

  @Post('/createWarehouse')
  async createWarehouse(@Body() dto: any, isUpdate: boolean = false): Promise<CommonResponse> {
    try {
      return await this.service.createWarehouse(dto, false);
    } catch (error) {
      console.log(error, 'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/updateWarehouse')
  async updateWarehouse(@Body() dto: any): Promise<CommonResponse> {
    try {
      return await this.service.createWarehouse(dto, true);
    } catch (error) {
      console.log(error, 'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Get('/getAllWarehouses')
  async getAllWarehouses(): Promise<CommonResponse> {
    try {
      return await this.service.getAllWarehouses();
    } catch (error) {
      console.log(error, 'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
  @Post('/getAllWarehousesByUnit')
  async getAllWarehousesByUnit(@Body() req: any): Promise<CommonResponse> {
    try {
      return await this.service.getAllWarehousesByUnit(req);
    } catch (error) {
      console.log(error, 'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/activateOrDeactivateWarehouse')
  async activateOrDeactivateWarehouse( @Body()request:any ): Promise<CommonResponse> {
    try {
      return await this.service.activateOrDeactivateWarehouse(request);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
}