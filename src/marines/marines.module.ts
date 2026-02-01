import { Module } from '@nestjs/common';
import { MarinesService } from './marines.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Marine, MarineSchema } from './schemas/marine.schema';
import { MarinesController } from './marines.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Marine.name, schema: MarineSchema }]),
  ],
  providers: [MarinesService],
  controllers: [MarinesController],
})
export class MarinesModule {}
