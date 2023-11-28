
import { Controller } from '@nestjs/common';
import { Body, Get, Post } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { UnitService } from './unit.service';
import { UnitDto } from './dto/unit.dto';
import { CommonResponse } from 'libs/shared-models/src/common';
import { GetAllUnitResponse } from 'libs/shared-models';

@Controller('unitData')
@ApiTags('unitData')

export class UnitController {
  constructor(private readonly service: UnitService) { }



  @Post('createUnit')
  createUnit(@Body() createDto: UnitDto): Promise<CommonResponse> {
  //   try {
     return this.service.createUnit(createDto);

  //   }
  
//  catch (error) {
//   return returnException()
// }  
}

  @Get('/getAllUnits')
  async getAllUnits(): Promise<GetAllUnitResponse> {
    try {
      return await this.service.getAllUnits();
    } catch (error) {
      return (error);
    }
  }


}