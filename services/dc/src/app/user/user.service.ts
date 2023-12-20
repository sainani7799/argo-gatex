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
    }
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

    const userInDb = await AppDataSource.getRepository(UserEntity).findOne({
      where: { cardNo: userDto.cardNo }
    });
    console.log(userInDb,'userInDb');
    if (userInDb) {
      console.log('user exists')
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user: UserEntity = await AppDataSource.getRepository(UserEntity).create({ userName, password, employeeId , cardNo,unitId});
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
    let query = `SELECT us.user_name AS userName ,emp.employee_code , emp.employee_name,emp.email_id ,u.unit_name,us.is_active AS isActive FROM shahi_user us 
    LEFT JOIN shahi_employees emp ON emp.employee_id = us.employee_id
    LEFT JOIN shahi_units u ON u.id = us.unit_id`
    const data = await AppDataSource.query(query)
    return (data)

  }

  async activateOrDeactivateUser(req: CreateUserDto): Promise<CommonResponse> {
    try {
        const userExists = await this.getUsersById(req.userId);
        console.log(userExists,'userExists')

        if (!userExists) {
            throw new CommonResponse(false, 10113, 'Someone updated the current user information. Refresh and try again');
        }

        const newStatus = req.isActive;
        const currentStatus = userExists.isActive;

        console.log('Current Status:', currentStatus); // Log current status

        if (newStatus === currentStatus) {
            const message = newStatus ? 'User is already activated' : 'User is already deactivated';
            throw new CommonResponse(false, newStatus ? 10112 : 10111, message);
        }

        const userStatus = await AppDataSource.getRepository(UserEntity).update(
            { userId: req.userId },
            { isActive: newStatus }
        );

        console.log('User Status:', userStatus.affected); // Log affected rows

        const successMessage = newStatus ? 'User is activated successfully' : 'User is deactivated successfully';
        const errorMessage = newStatus ? 'User is already activated' : 'User is already deactivated';

        const response = new CommonResponse(true, newStatus ? 10114 : 10115, userStatus.affected ? successMessage : errorMessage);
        return response;

    } catch (err) {
        return err;
    }
}

async getUsersById(userId: number): Promise<UserEntity> {
    const Response = await AppDataSource.getRepository(UserEntity).findOne({
        where: { userId: userId },
    });
    if (Response) {
        return Response;
    } else {
        return null;
    }
}


}