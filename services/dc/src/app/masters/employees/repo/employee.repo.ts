import { Injectable } from "@nestjs/common";
import {Repository } from "typeorm";
import {  EmployeeEntity } from "../entity/employee.entity";

@Injectable()
export class EmployeeRepository extends Repository<EmployeeEntity>{
   
}