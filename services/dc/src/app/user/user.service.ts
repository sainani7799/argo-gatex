import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UserEntityRepository } from "./repository/user-repository";
import { Repository } from 'typeorm';
import { LoginDto, AuthResponseModel, AuthModel } from 'libs/shared-models';
import { AppDataSource } from "../app-data-source";
import { CreateUserDto } from "./dto/user.dto";
import { toUserDto } from "./mapper";
import { UserRequestDto } from "./dto/user-request.dto";
import { DataSource } from 'typeorm';
import { CommonResponse } from "libs/shared-models/src/common";


@Injectable()
export class UserMangementService {
  constructor(
    // @InjectRepository(UserEntity)
    private userRepo: UserEntityRepository,
    // userRepository: UserEntityRepository,
    // @InjectDataSource() private dataSource: DataSource
    
  ) { }

  async login(dto: LoginDto): Promise<AuthResponseModel> {
    console.log(dto,'DTO')
    const query = `SELECT user_name AS userName, PASSWORD,employee_id AS employeeId,unit_id AS unitId, un.unit_name AS unitName,un.unit_code AS unitCode,un.factory_code ,card_no AS cardNo FROM shahi_user u LEFT JOIN shahi_units un ON un.id = u.unit_id WHERE user_name = '${dto.userName}' AND password = '${dto.password}'`;
    try {
      const validateUser = await await AppDataSource.query(query);
      console.log(validateUser, 'user data');

      if (validateUser.length > 0) {
        const authModel = new AuthModel(validateUser[0].userName,validateUser[0].employeeId,validateUser[0].cardNo,validateUser[0].unitId,validateUser[0].unitName,validateUser[0].unitCode);
        return new AuthResponseModel(true, 1111, 'Successfully logged in', authModel);
      } else {
        return new AuthResponseModel(false, 401, 'Invalid credentials', null);
      }
    } catch (error) {
      console.error(error);
      // throw new InternalServerErrorException('Internal server error');
    }
    // const validateUser = await AppDataSource.manager.findOneBy(UserEntity, { userName: dto.userName, password: dto.password })
    // console.log(validateUser, 'user data')
    // if (validateUser) return new AuthResponseModel(false, 1111, 'Please check your credentials')
    // const rolesQuery = `SELECT  urp.role AS role ,r.role_name AS roleName  FROM Users urp LEFT JOIN Role r ON  r.role_id= urp.role WHERE urp.id = ${validateUser.userId}` 
    // const rolesData = await projectPlanningDataSource.query(rolesQuery);
    // console.log(rolesData)
    // const rolesData = [{role:'',companyId:1}]
    // const authModel = new AuthModel(validateUser.userName ,validateUser.employeeId)
    // return new AuthResponseModel(true, 1111, 'Sucessfully logged in', authModel)
  }

  async getAllUsers(): Promise<any> {
    const usersData = await this.userRepo.find();
    if (usersData.length > 0) {
      return usersData
    }
  }

  async getUserById(req: UserRequestDto): Promise<any> {
    const usersData = await this.userRepo.find({ where: { employeeId: req.employeeId } });
    if (usersData.length > 0) {
      return usersData
    }
  }

  async create(userDto: CreateUserDto): Promise<CommonResponse> {
    const { userId, userName, password, employeeId ,cardNo,unitId } = userDto;

    // check if the user exists in the db    
    console.log(userDto,'userDto')
    console.log(userDto.cardNo,'userDto.cardNo')
    const userInDb = await AppDataSource.getRepository(UserEntity).findOne({
      where: { cardNo: userDto.cardNo }
    });
    console.log(userInDb,'userInDb');
    if (userInDb) {
      console.log('user exists')
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user: UserEntity = await AppDataSource.getRepository(UserEntity).create({ userName, password, employeeId , cardNo,unitId});
    console.log(user,'user.....')
    await AppDataSource.getRepository(UserEntity).save(user);
    return toUserDto(user);
}

  async register(userDto: CreateUserDto): Promise<any> {
    try {
      const user = await this.create(userDto);
      return {
        success: true,
        message: 'User registered',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Internal server error',
      };
    }
  }
  async getUsers(): Promise<any> {
    let query = `SELECT us.user_name AS userName ,emp.employee_code , emp.employee_name,emp.email_id FROM shahi_user us LEFT JOIN shahi_employees emp ON emp.employee_id = us.employee_id`
    const data = await AppDataSource.query(query)
    return (data)

  }


}