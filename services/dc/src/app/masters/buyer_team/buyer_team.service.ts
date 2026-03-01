import { Injectable } from '@nestjs/common';
import { CreateBuyerTeamDto } from './dto/buyer_team.dto';
import { CommonResponse } from '@gatex/shared-models';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerTeamEntity } from './entities/buyer_team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BuyerTeamService {
  constructor(
    @InjectRepository(BuyerTeamEntity)
    private buyerRepo: Repository<BuyerTeamEntity>
  ) { }

    async createBuyer(buyerDto: CreateBuyerTeamDto, isUpdate: boolean): Promise<CommonResponse> {
      console.log(buyerDto, '------------------Buyer dto')
      const buyerInDb = await this.buyerRepo.find({
        where: { buyerTeam: buyerDto.buyerTeam }
      });

      if (!isUpdate) {
        console.log(buyerInDb, 'Buyer data from db-------------------')
        if (buyerInDb.length) {
          return new CommonResponse(false, 1111, "Buyer details is Already exsits");
        }
      }
      
      if (buyerInDb.length) {
        return new CommonResponse(false, 1111, "exsits");
      }
      const entity = new BuyerTeamEntity()
      entity.buyerTeam = buyerDto.buyerTeam
      entity.createdUser = buyerDto.createdUser;
      entity.buyerTeam = buyerDto.buyerTeam
      entity.updatedUser = buyerDto.updatedUser
      if (buyerDto.buyerTeamId) {
        entity.buyerTeamId = buyerDto.buyerTeamId
      }
      console.log(entity, 'save data-------------')
      const save = await this.buyerRepo.save(entity)
      // if(save) return new CommonResponse(true, 1, isUpdate ? 'User Updated Successfully' : 'User created Successfully');
      if (save) return new CommonResponse(true, 1, isUpdate ? 'Buyer created Successfully' : 'Buyer Updated Successfully');
      // return new CommonResponse(false,1,isUpdate ? 'User Updation failed' : 'User creation failed')
      return new CommonResponse(false, 1, isUpdate ? 'Buyer creation failed' : 'Buyer Updation failed')
    }

    async getAllActiveBuyer(): Promise<CommonResponse>{
      const data = await this.buyerRepo.find({where : {isActive : true}})
      return new CommonResponse(true, 2222, 'Buyer Team data retrieved successfully', data)
    }

    async deleteBuyer(buyerId: any):Promise<CommonResponse>{
      console.log(buyerId, 'buyerId')
      // const data = await this.buyerRepo.delete({buyerTeamId : buyerId.buyerId})
      const data = await this.buyerRepo.update({ buyerTeamId : buyerId.buyerId },{isActive : false})
      return new CommonResponse(true, 2222, 'Buyer Team data Deleted successfully', data)
    }
}
