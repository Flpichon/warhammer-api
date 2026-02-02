import { Module } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Battle, BattleSchema } from './schemas/battle.schema';
import { BattlesController } from './battles.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Battle.name, schema: BattleSchema }]),
  ],
  providers: [BattlesService],
  controllers: [BattlesController],
})
export class BattlesModule {}
