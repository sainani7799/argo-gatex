import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AddressService } from "./address.service";
import { CommonResponse } from "libs/shared-models/src/common";

@Controller('address')
@ApiTags('address')

export class AddressController {
  applicationExceptionHandler: any;
  constructor(private readonly service: AddressService) { }

  @Post('/createAddress')
  async createAddress(@Body() dto: any , isUpdate:boolean=false): Promise<CommonResponse> {
    try {
      return await this.service.createAddress(dto,false);
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/updateAddress')
  async updateAddress(@Body() dto: any): Promise<CommonResponse> {
    try {
      return await this.service.createAddress(dto,true);
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Get('/getAllAddress')
  async getAllAddress(): Promise<CommonResponse> {
    try {
      return await this.service.getAllAddress();
    } catch (error) {
      return (error);
    }
  }
  @Post('/getAllAddressByUnit')
  async getAllAddressByUnit(@Body() req:any): Promise<CommonResponse> {
    try {
      return await this.service.getAllAddressByUnit(req);
    } catch (error) {
      return (error);
    }
  }
  @Post('/getAllToAddressByUnit')
  async getAllToAddressByUnit(@Body() req:any): Promise<CommonResponse> {
    try {
      return await this.service.getAllToAddressByUnit(req);
    } catch (error) {
      return (error);
    }
  }

  @Post('/activateOrDeactivateAddress')
  async activateOrDeactivateAddress( @Body()request:any ): Promise<CommonResponse> {
    try {
      return await this.service.activateOrDeactivateAddress(request);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
}