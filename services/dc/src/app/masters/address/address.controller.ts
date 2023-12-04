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
  async createAddress(@Body() dto: any): Promise<CommonResponse> {
    try {
      return await this.service.createAddress(dto);
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
}