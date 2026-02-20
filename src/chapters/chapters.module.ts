import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from './schemas/chapter.schema';
import { ChaptersRepository } from './repository/chapters.repository';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { MarinesModule } from '../marines/marines.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    MarinesModule,
  ],
  providers: [ChaptersService, ChaptersRepository],
  controllers: [ChaptersController],
  exports: [ChaptersRepository],
})
export class ChaptersModule {}
