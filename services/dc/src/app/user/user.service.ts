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
        if (userExists) {
            if (!userExists) {
                throw new CommonResponse(false, 10113, 'Someone updated the current User information.Refresh and try again');
            } else {

                const userStatus = await AppDataSource.getRepository(UserEntity).update(
                    { userId: req.userId },
                    { isActive: req.isActive, });

                if (userExists.isActive) {
                    if (userStatus.affected) {
                        const userResponse: CommonResponse = new CommonResponse(true, 10115, 'User is de-activated successfully');
                        return userResponse;
                    } else {
                        throw new CommonResponse(false, 10111, 'User is already deactivated');
                    }
                } else {
                    if (userStatus.affected) {
                        const userResponse: CommonResponse = new CommonResponse(true, 10114, 'User is activated successfully');
                        return userResponse;
                    } else {
                        throw new CommonResponse(false, 10112, 'User is already  activated');
                    }
                }
            }
        } else {
            throw new CommonResponse(false, 998, 'No Records Found');
        }
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