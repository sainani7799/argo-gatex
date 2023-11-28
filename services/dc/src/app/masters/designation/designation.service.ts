import { Injectable } from "@nestjs/common";
import { DesignationRepository } from "./repository/designation.repo";
import { AppDataSource } from "../../app-data-source";
import { DesignationEntity } from "./entity/designation.entity";
import { CommonResponse } from "libs/shared-models/src/common";

@Injectable()
export class DesignationService {

    constructor(
        // @InjectRepository(DesignationEntity)
        private repository: DesignationRepository
      ) { }

      async getAllDesignations(): Promise<CommonResponse> {
        try{
          const data = await AppDataSource.getRepository(DesignationEntity).find();
          if (data.length> 0) {
            return new CommonResponse(true,990,'data retrieve successfully',data)
          }else{
            return new CommonResponse(false,990,'something went to wrong')
          }
        }catch (error){
          throw error
        }
       
      }
}