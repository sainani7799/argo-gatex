import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleAdapter } from './role.adapter';
import { RoleEntity } from './entity/role.entity';
import { CommonResponse } from 'libs/shared-models/src/common';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
    // private adapter: RoleAdapter
  ) { }

  async getAllRoles():Promise<CommonResponse>{
    try{
      const data = await this.repository.find()
      return new CommonResponse(true,888,'data retried successfully',data)
    }catch(error){
      return new CommonResponse(false,88,'something went wrong',)
    }
  }

  async getAllRoleEntity(): Promise<any> {

    const data = await this.repository.find();

    if (data.length === 0) {
      console.log('oooo')
    }
    return data
  }


}