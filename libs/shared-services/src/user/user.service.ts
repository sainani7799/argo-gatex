import { AuthResponseModel,CreateUserDto,LoginDto, UserModel } from '@gatex/shared-models';
import { CommonAxiosServicePms } from "../common-axios-service-prs";
import { CommonResponse } from '@gatex/shared-models';

export class UserManagementServices extends CommonAxiosServicePms {
    private userManagementController = '/user-management';


    async login(dto: LoginDto): Promise<AuthResponseModel> {
        return await this.axiosPostCall(this.userManagementController + '/login', dto)
    }
    async getAllUsers(): Promise<any> {
        return await this.axiosPostCall(this.userManagementController + '/getAllUsers')
    }

    async register(dto:CreateUserDto): Promise<CommonResponse> {
        return await this.axiosPostCall(this.userManagementController + '/register',dto)
    }

    async getUsers(): Promise<any> {
        return await this.axiosPostCall(this.userManagementController + '/getUsers')
    }

    async activateOrDeactivateUser(  req: CreateUserDto): Promise<any> {
        return this.axiosPostCall(this.userManagementController + '/activateOrDeactivateUser', req)
      }

    async updateUser(dto:CreateUserDto): Promise<any> {
        return await this.axiosPostCall(this.userManagementController + '/register',dto)
    }

    async getPassword(req : any): Promise<any> {
        return await this.axiosPostCall(this.userManagementController + '/getPassword' , req)
    }

    async updatePassword(req : any): Promise<any> {
        return await this.axiosPostCall(this.userManagementController + '/updatePassword' , req)
    }
}