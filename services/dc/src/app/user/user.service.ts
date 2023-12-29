import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UserEntityRepository } from "./repository/user-repository";
import { Repository } from 'typeorm';
import { LoginDto, AuthResponseModel, AuthModel } from 'libs/shared-models';
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
    const query = `SELECT user_name AS userName, PASSWORD,employee_id AS employeeId,unit_id AS unitId, un.unit_name AS unitName,un.unit_code AS unitCode,un.factory_code ,card_no AS cardNo,u.role_id AS roleId ,r.role_name FROM shahi_user u LEFT JOIN shahi_units un ON un.id = u.unit_id LEFT JOIN shahi_role r ON r.role_id = u.role_id WHERE u.is_active = 1 AND user_name = '${dto.userName}' AND password = '${dto.password}'`;
    try {
      const validateUser = await this.userRepo.query(query);
      console.log(validateUser, 'user data');

      if (validateUser.length > 0) {
        const authModel = new AuthModel(validateUser[0].userName,validateUser[0].employeeId,validateUser[0].cardNo,validateUser[0].unitId,validateUser[0].unitName,validateUser[0].unitCode,validateUser[0].roleId,validateUser[0].roleName);
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
    const { userId, userName, password, employeeId ,cardNo,unitId,roleId } = userDto;

    const userInDb = await this.userRepo.findOne({
      where: { cardNo: userDto.cardNo }
    });
    console.log(userInDb,'userInDb');
    if (userInDb) {
      console.log('user exists')
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user: UserEntity = await this.userRepo.create({ userName, password, employeeId , cardNo,unitId,roleId});
    await this.userRepo.save(user);
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
    let query = `SELECT us.id as userId, us.user_name AS userName ,emp.employee_code , emp.employee_name,emp.email_id ,u.unit_name,us.is_active AS isActive FROM shahi_user us 
    LEFT JOIN shahi_employees emp ON emp.employee_id = us.employee_id
    LEFT JOIN shahi_units u ON u.id = us.unit_id`
    const data = await this.userRepo.query(query)
    return (data)

  }

  async activateOrDeactivateUser(req: CreateUserDto): Promise<CommonResponse> {
    try {
      const userExists = await this.getUsersById(req.userId);
      
      if (userExists) {
        if (!userExists) {
          throw new CommonResponse(false, 10113, 'Someone updated the current user information.Refresh and try again');
        } else {

          const userStatus = await this.userRepo.update(
            { userId: req.userId },
            { isActive: req.isActive });
          if (userExists.isActive) {
            if (userStatus.affected) {
              const userResponse: CommonResponse = new CommonResponse(true, 10115, 'user  is de-activated successfully');
              return userResponse;
            } else {
              throw new CommonResponse(false, 10111, 'user is already deactivated');
            }
          } else {
            if (userStatus.affected) {
              const userResponse: CommonResponse = new CommonResponse(true, 10114, 'user is activated successfully');
              return userResponse;
            } else {
              throw new CommonResponse(false, 10112, 'user  is already  activated');
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

async getUsersById(userId: number): Promise<UserEntity> {
    const Response = await this.userRepo.findOne({
        where: { userId: userId },
        
    });console.log(userId,'userId....')
    if (Response) {
        return Response;
        
    } else {
        return null;
    }
}


}