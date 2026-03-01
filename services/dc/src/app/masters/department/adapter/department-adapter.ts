import { Injectable } from '@nestjs/common';
import { DepartmentDto } from '../dto/department.dto';
import { DepartmentEntity } from '../entity/department.entity';


@Injectable()
export class DepartmentAdapter {
    convertDtoToEntity(departmentDto: DepartmentDto): DepartmentEntity {
        const entity = new DepartmentEntity;
        entity.departmentName = departmentDto.departmentName;
        if (departmentDto.Id) {
            entity.id = departmentDto.Id;
        }
        return entity;
    }

}