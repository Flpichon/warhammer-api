import { Module } from '@nestjs/common';
import { SquadsService } from './squads.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Squad, SquadSchema } from './schemas/squad.schema';
import { SquadsController } from './squads.controller';
import { MarinesModule } from '../marines/marines.module';
import { SquadsRepository } from './repository/squads.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Squad.name, schema: SquadSchema }]),
    MarinesModule,
  ],
  providers: [SquadsService, SquadsRepository],
  controllers: [SquadsController],
})
export class SquadsModule {}
