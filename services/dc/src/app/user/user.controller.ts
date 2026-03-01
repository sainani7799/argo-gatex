import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { UserMangementService } from "./user.service";
import { AuthResponseModel, LoginDto, UserResponse } from "@gatex/shared-models";
import { ApplicationExceptionHandler } from 'libs/backend-utils/src/lib/libs/application-exception-handler';
import { CreateUserDto } from "./dto/user.dto";
import { UserRequestDto } from "./dto/user-request.dto";
import { CommonResponse } from "@gatex/shared-models";


@Controller("/user-management")
export class UserManagementController {
  constructor(
    private readonly companyService: UserMangementService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }

 

  @Post('/login')
  async createProject(@Body() dto: any): Promise<AuthResponseModel> {
    try {
      return await this.companyService.login(dto);
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(AuthResponseModel, error);
    }
  }

  @Post('/getUserById')
  async getUserById(@Body() req:UserRequestDto): Promise<UserResponse> {
    try {
      return await this.companyService.getUserById(req);
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(UserResponse, error);
    }
  }

  @Post('/getAllUsers')
  async getAllUsers(): Promise<UserResponse> {
    try {
      return await this.companyService.getAllUsers();
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(UserResponse, error);
    }
  }

  // @Post('/register')  
  // public async register(@Body() createUserDto: any): Promise<any> {    
  //   const result: 
  //   any = await this.companyService.create(createUserDto,false);
  //   if (!result.success) {
  //       throw new HttpException(result.message, HttpStatus.BAD_REQUEST);    
  //   }
  //   // console.log(result);
  //   return result;  
  // }

  @Post('/register')
  async register(@Body() createDto: any): Promise<any> {
      try {
          return await this.companyService.create(createDto,true);
      } catch (error) {
          return (error)
      }
  }

  
  @Post('/updateUsers')
  async updateUsers(@Body() createDto: any): Promise<any> {
      try {
          return await this.companyService.create(createDto,true);
      } catch (error) {
          return (error)
      }
  }

  @Post('/getUsers')
  async getUsers(): Promise<UserResponse> {
    try {
      return await this.companyService.getUsers();
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(UserResponse, error);
    }
  }

  @Post('/activateOrDeactivateUser')
  async activateOrDeactivateUser( @Body()request:any ): Promise<CommonResponse> {
    try {
      return await this.companyService.activateOrDeactivateUser(request);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/getPassword')
  async getPassword( @Body()request:any ): Promise<any> {
    try {
      return await this.companyService.getPassword(request);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/updatePassword')
  async updatePassword( @Body()request:any ): Promise<any> {
    try {
      return await this.companyService.updatePassword(request);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
  
}