import { Injectable } from '@nestjs/common';
import { UnitDto } from '../dto/unit.dto';
import { UnitEntity } from '../entity/unit.entity';


@Injectable()
export class UnitAdapter {
    convertDtoToEntity(UnitDto: UnitDto): UnitEntity {
        const entity = new UnitEntity;
        entity.unitName = UnitDto.unitName;
       


        if (UnitDto.id) {
            entity.id = UnitDto.id;
        }

        return entity;
    }

}