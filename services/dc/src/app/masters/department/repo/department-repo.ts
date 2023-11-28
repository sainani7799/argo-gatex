import { Injectable } from "@nestjs/common";
import {  Repository } from "typeorm";
import { DepartmentEntity } from "../entity/department.entity";

@Injectable()
export class DepartmentRepository extends Repository<DepartmentEntity>{
   
}