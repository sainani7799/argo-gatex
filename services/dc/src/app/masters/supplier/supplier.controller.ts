import { Body, Controller, Get, Post } from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { CommonResponse } from "libs/shared-models/src/common";
import { CreateSupplierDto } from "./dto/supplier.dto";

@Controller("/suppliers")
export class SupplierController {
  constructor(
    private readonly service: SupplierService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }


  @Post('/createSupplier')
  async createSupplier(@Body() dto: any, isUpdate:boolean=false): Promise<CommonResponse> {
    try {
      return await this.service.createSupplier(dto ,false);
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
  
  @Post('/updateSupplier')
  async updateSupplier(@Body() dto: any): Promise<CommonResponse> {
    try {
      return await this.service.createSupplier(dto,true);
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Get('/getAllSuppliers')
  async getAllSuppliers(): Promise<CommonResponse> {
    try {
      return await this.service.getAllSuppliers();
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
  @Post('/activateOrDeactivateSupplier')
  async activateOrDeactivateSupplier( @Body()request:any ): Promise<CommonResponse> {
    try {
      return await this.service.activateOrDeactivateSupplier(request);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
}