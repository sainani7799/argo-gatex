import { Injectable } from '@nestjs/common';
import { RoleEntity } from './entity/role.entity';
import { RoleDto } from './dto/role.dto';


@Injectable()
export class RoleAdapter {
    convertDtoToEntity(departmentDto: RoleDto): RoleEntity {
        const entity = new RoleEntity;
        entity.roleName = departmentDto.roleName;
        entity.isActive = departmentDto.isActive;
        entity.createdAt = departmentDto.createdAt;
       
        if (RoleDto.Id) {
            entity.Id = RoleDto.Id;
        }

        return entity;
    }

}