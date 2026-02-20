import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { FindChaptersQueryDto } from './dto/find-chapters.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/auth.types';

@Controller('chapters')
@UseGuards(JwtAuthGuard)
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  create(@Body() dto: CreateChapterDto, @CurrentUser() user: JwtPayload) {
    return this.chaptersService.create({
      ownerId: user.sub,
      name: dto.name,
      parentId: dto.parentId ?? null,
    });
  }

  @Get('tree')
  findTree(@CurrentUser() user: JwtPayload) {
    return this.chaptersService.findTree(user.sub);
  }

  @Get()
  findAll(
    @Query() query: FindChaptersQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.chaptersService.findAll({
      ownerId: user.sub,
      q: query.q,
      parentId: query.parentId,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const chapter = await this.chaptersService.findById({
      id,
      ownerId: user.sub,
    });
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }
    return chapter;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateChapterDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.chaptersService.update({
      ownerId: user.sub,
      id,
      name: dto.name,
      parentId: dto.parentId,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.chaptersService.remove({ ownerId: user.sub, id });
  }
}
