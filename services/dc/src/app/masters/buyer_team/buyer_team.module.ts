import { Module } from '@nestjs/common';
import { BuyerTeamService } from './buyer_team.service';
import { BuyerTeamController } from './buyer_team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerTeamEntity } from './entities/buyer_team.entity';

@Module({
  controllers: [BuyerTeamController],
  providers: [BuyerTeamService],
  imports: [TypeOrmModule.forFeature([BuyerTeamEntity])]
})
export class BuyerTeamModule {}
