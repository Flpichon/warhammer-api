import { Module } from '@nestjs/common';
import { MarinesService } from './marines.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Marine, MarineSchema } from './schemas/marine.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Marine.name, schema: MarineSchema }]),
  ],
  providers: [MarinesService],
})
export class MarinesModule {}
