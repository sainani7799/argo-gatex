import { Injectable } from "@nestjs/common";
import { ApprovedUserEntityRepository } from "./repository/approval-user.repository";
import { ApprovedUserDto } from "./dto/appUser";
import { CommonResponse } from "libs/shared-models/src/common";
import { AppDataSource } from "../../app-data-source";
import { ApprovedUserEntity } from "./entity/appUser.entity";
import { ApprovalIdReq } from "libs/shared-models";

@Injectable()
export class ApprovedUserService {
    constructor(
        private SupplierRepo: ApprovedUserEntityRepository,

    ) { }

    async createApprovalUser(dto: ApprovedUserDto | ApprovedUserDto[]): Promise<CommonResponse> {
        const supplier = Array.isArray(dto) ? dto : [dto];
        try {
            for (const obj of supplier) {
                const existingRecord = await AppDataSource.getRepository(ApprovedUserEntity).findOne({ where: { approvedUserName: obj.approvedUserName } });

                if (existingRecord) {
                    return new CommonResponse(false, 0, "user already existed", []);
                } else {
                    for (const obj of supplier) {
                        const entity = new ApprovedUserEntity()
                        entity.approvedId = obj.approvedId;
                        entity.approvedUserName = obj.approvedUserName;
                        entity.emailId = obj.emailId;
                        entity.sigImageName = obj.sigImageName;
                        entity.signPath = obj.signPath;
                        entity.createdUser = obj.createdUser;
                        const create = await AppDataSource.getRepository(ApprovedUserEntity).save(entity)
                        console.log(create)
                        return await new CommonResponse(true, 111, 'Approved User created successfully', create)
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async updatePath(filePath: string, fileName: string, id: number): Promise<CommonResponse> {
        try {
            console.log("coming ra mawa",filePath,fileName)
            console.log(id)
            let imagePathUpdate;
            imagePathUpdate = await AppDataSource.getRepository(ApprovedUserEntity).update(
                { approvedId: id },
                { signPath: filePath, sigImageName: fileName },
            );
            const result = await AppDataSource.getRepository(ApprovedUserEntity).findOne({ where: { approvedId: id } })
            console.log('*****result*****', result)
            if (imagePathUpdate.affected > 0) {
                return new CommonResponse(true, 11, 'Uploaded successfully', filePath);
            }
            else {
                return new CommonResponse(false, 11, 'Uploaded failed', filePath);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getAllApprovalUser():Promise<CommonResponse>{
        try{
            const query = `SELECT a.approved_id AS approvedId , a.approved_user_name AS approvalUserId,e.employee_name AS approvalUser,a.email_id AS emailId FROM shahi_approved_users a
            LEFT JOIN shahi_employees e ON e. employee_id = a.approved_user_name`
            const data = await AppDataSource.query(query)
            return await new CommonResponse(true, 111, 'Data Retrieved successfully', data)
        }catch(error){
            console.log(error)
        }
    }

    async getAllApprovalIdUser(req:ApprovalIdReq):Promise<CommonResponse>{
        console.log(req,'req;;;;')
        try{
            const query = `SELECT a.approved_id AS approvedId , a.approved_user_name AS approvalUserId,e.employee_name AS approvalUser,a.email_id AS emailId ,a.sign_path FROM shahi_approved_users a
            LEFT JOIN shahi_employees e ON e. employee_id = a.approved_user_name where a.approved_user_name = ${req.approvedUserId}`
            const data = await AppDataSource.query(query)
            return await new CommonResponse(true, 111, 'Data Retrieved successfully', data)
        }catch(error){
            console.log(error)
        }
    }
}