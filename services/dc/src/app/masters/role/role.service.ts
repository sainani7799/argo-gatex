import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleAdapter } from './role.adapter';
import { RoleEntity } from './entity/role.entity';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
    // private adapter: RoleAdapter
  ) { }

  async getAllRoleEntity(): Promise<any> {

    const data = await this.repository.find();

    if (data.length === 0) {
      console.log('oooo')
    }
    return data
  }


}