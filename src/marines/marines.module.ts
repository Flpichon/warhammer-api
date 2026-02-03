import { Module } from '@nestjs/common';
import { MarinesService } from './marines.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Marine, MarineSchema } from './schemas/marine.schema';
import { MarinesController } from './marines.controller';
import { MarinesRepository } from './repository/marines.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Marine.name, schema: MarineSchema }]),
  ],
  providers: [MarinesService, MarinesRepository],
  controllers: [MarinesController],
  exports: [MarinesRepository],
})
export class MarinesModule {}
