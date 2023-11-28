
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitEntity } from './entity/unit.entity';
import { UnitAdapter } from './adapter/branch-adapter';
import { UnitDto } from './dto/unit.dto';
import { UnitRepository } from './repo/unit-repo';
import { CommonResponse } from 'libs/shared-models/src/common';
import { AppDataSource } from '../../app-data-source';

@Injectable()
export class UnitService {

  constructor(
    // @InjectRepository(UnitEntity)
    private repository: UnitRepository,
    private adapter: UnitAdapter
  ) { }



  async createUnit(createDto: UnitDto): Promise<any> {
    const save = this.adapter.convertDtoToEntity(createDto);
    let internalMessage: string
    if (createDto.id) {
      internalMessage = "Updated Successfully"
      const findRecord = await this.repository.findOne({ where: { id: createDto.id } });
      if (findRecord.versionFlag !== createDto.versionFlag) {

      }
    } else {
      internalMessage = "Created Successfully"
    }
    const savedData = await this.repository.save(save);

    return { data: savedData, message: internalMessage }

  }
  async getAllUnits(): Promise<CommonResponse> {

    try {
      const data = await AppDataSource.getRepository(UnitEntity).find();
      if (data.length > 0) {
        return new CommonResponse(true,22,'data retrieve successfully',data)
      }else{
        return new CommonResponse(false,22,'something went to wrong')
      }
    }catch(error){
      throw error
    }
  }


}