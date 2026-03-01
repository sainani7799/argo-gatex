
import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { DepartmentDto } from './dto/department.dto';
import { CommonResponse } from '@gatex/shared-models';
import { DepartmentIdReq } from '@gatex/shared-models';

@Controller('departmentdata')
@ApiTags('deparmentdata')

export class DepartmentController {
  constructor(private readonly service: DepartmentService) { }


  @Post('createDepartment')
  createDepartment(@Body() createDto: DepartmentDto): Promise<CommonResponse> {
  //   try {
     return this.service.createDepartment(createDto);

  //   }
  
//  catch (error) {
//   return returnException()
// }  
}


  @Post('getAllDepartments')
  async getAllDepartments(): Promise<any> {
    try {
      return await this.service.getAllDepartments();
    } catch (error) {
      return (error);
    }
  }

  @Post('getAllSectionsForDrop')
  async getAllSectionsForDrop(@Body() Req:any): Promise<any> {
    try {
      return await this.service.getAllSectionsForDrop(Req);
    } catch (error) {
      return (error);
    }
  }


}