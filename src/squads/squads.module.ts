import { Module } from '@nestjs/common';
import { SquadsService } from './squads.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Squad, SquadSchema } from './schemas/squad.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Squad.name, schema: SquadSchema }]),
  ],
  providers: [SquadsService],
})
export class SquadsModule {}
