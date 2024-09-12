import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BuyerTeamService } from './buyer_team.service';

@Controller('/buyer-team')
export class BuyerTeamController {
  constructor(private readonly buyerTeamService: BuyerTeamService) {}

  @Post('/createBuyer')
  async createBuyer(@Body() req: any): Promise<any> {
      try {
          return await this.buyerTeamService.createBuyer(req,true);
      } catch (error) {
          // return (error)
          console.log(error)
      }
  }

  @Post('/getAllActiveBuyer')
  async getAllActiveBuyer(): Promise<any> {
      try {
          return await this.buyerTeamService.getAllActiveBuyer();
      } catch (error) {
          // return (error)
          console.log(error)
      }
  }

  @Post('/updateBuyer')
  async updateBuyer(@Body() req: any): Promise<any> {
      try {
          return await this.buyerTeamService.createBuyer(req,false);
      } catch (error) {
          // return (error)
          console.log(error)
      }
  }

  @Post('/deleteBuyer')
  async deleteBuyer(@Body() req: any): Promise<any> {
      try {
          return await this.buyerTeamService.deleteBuyer(req);
      } catch (error) {
          // return (error)
          console.log(error)
      }
  }


}
