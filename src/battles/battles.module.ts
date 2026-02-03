import { Module } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Battle, BattleSchema } from './schemas/battle.schema';
import { BattlesController } from './battles.controller';
import { BattlesRepository } from './repository/battles.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Battle.name, schema: BattleSchema }]),
  ],
  providers: [BattlesService, BattlesRepository],
  controllers: [BattlesController],
})
export class BattlesModule {}
