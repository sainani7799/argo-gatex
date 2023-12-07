import { Body, Controller, Get, Post } from "@nestjs/common";
import { ItemService } from "./item.service";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { CommonResponse } from "libs/shared-models/src/common";

@Controller("/item-controller")
export class ItemController {
  constructor(
    private readonly service: ItemService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }

  @Post('/createItem')
  async createItem(@Body() dto: any): Promise<CommonResponse> {
    try {
      return await this.service.createItem(dto);
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Get('/getAllItems')
  async getAllItems(): Promise<CommonResponse> {
    try {
      return await this.service.getAllItems();
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
  @Post('/getAllItemsByCode')
  async getAllItemsByCode(@Body() req:any): Promise<CommonResponse> {
    try {
      return await this.service.getAllItemsByCode(req);
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

}