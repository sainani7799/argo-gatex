import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { DcService } from "./dc.service";
import { CommonResponse } from "libs/shared-models/src/common";
import { ApiTags } from "@nestjs/swagger";

@Controller("dc")
export class DcController {
  applicationExceptionHandler: any;
  constructor(
    private readonly dcService: DcService ,
  ) { }

  @Post('/createDc')
  async createDc(@Body() dto: any, isUpdate: boolean = false): Promise<CommonResponse> {
    try {
      return await this.dcService.createDc(dto, false);
    } catch (error) {
      console.log(error)
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/updateDc')
  async updateDc(@Body() dto: any,): Promise<CommonResponse> {
    try {
      return await this.dcService.updateDc(dto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Get('/getAllGatePass')
  async getAllGatePass(): Promise<CommonResponse> {
    try {
      return await this.dcService.getAllGatePass();
    } catch (error) {
      return (error);
    }
  }

  @Post('/getDcDetailsById')
  async getDcDetailsById(@Body() req: any): Promise<CommonResponse> {
    try {
      return await this.dcService.getDcDetailsById(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
}