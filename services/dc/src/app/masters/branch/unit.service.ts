
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitEntity } from './entity/unit.entity';
import { UnitAdapter } from './adapter/branch-adapter';
import { UnitDto } from './dto/unit.dto';
import { UnitRepository } from './repo/unit-repo';
import { CommonResponse } from '@gatex/shared-models';
import { UnitReq } from '@gatex/shared-models';

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
      const data = await this.repository.find({where:{isActive:true}});
      if (data.length > 0) {
        return new CommonResponse(true,22,'data retrieve successfully',data)
      }else{
        return new CommonResponse(false,22,'something went to wrong')
      }
    }catch(error){
      throw error
    }
  }

  async activateOrDeactivateUnits(req: UnitReq): Promise<CommonResponse> {
    console.log(req,'---------unit req')
    try {
      const unitExists = await this.getUnitsById(req.unitId);
      if (unitExists) {
        if (!unitExists) {
          throw new CommonResponse(false, 10113, 'Someone updated the current Unit information.Refresh and try again');
        } else {

          const unitStatus = await this.repository.update(
            { id: req.unitId },
            { isActive: req.isActive });

          if (unitExists.isActive) {
            if (unitStatus.affected) {
              const ProfitResponse: CommonResponse = new CommonResponse(true, 10115, 'Unit  is de-activated successfully');
              return ProfitResponse;
            } else {
              throw new CommonResponse(false, 10111, 'Unit is already deactivated');
            }
          } else {
            if (unitStatus.affected) {
              const ProfitResponse: CommonResponse = new CommonResponse(true, 10114, 'Unit is activated successfully');
              return ProfitResponse;
            } else {
              throw new CommonResponse(false, 10112, 'Unit  is already  activated');
            }
          }
        }
      } else {
        throw new CommonResponse(false, 99998, 'No Records Found');
      }
    } catch (err) {
      return err;
    }
  }

  async getUnitsById(unitId: number): Promise<UnitEntity> {
    const Response = await this.repository.findOne({
      where: { id:unitId },
    });
    if (Response) {
      return Response;
    } else {
      return null;
    }
  }


}