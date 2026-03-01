
import { Controller } from '@nestjs/common';
import { Body, Get, Post } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';

@Controller('/roledata')
@ApiTags('roledata')

export class RoleController {
  constructor(private readonly service: RoleService) { }

  @Get('/getAllRoleEntity') 
  async getAllRoleEntity(): Promise<any> {
    try {
      return await this.service.getAllRoleEntity();
    } catch (error) {
      return (error);
    }
  }


}