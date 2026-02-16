import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MarinesService } from './marines.service';
import { CreateMarineDto } from './dto/create-marine.dto';
import { UpdateMarineDto } from './dto/update-marine.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/auth.types';
import { FindMarinesQueryDto } from './dto/find-marines.dto';

@Controller('marines')
@UseGuards(JwtAuthGuard)
export class MarinesController {
  constructor(private readonly marinesService: MarinesService) {}

  @Post()
  create(@Body() dto: CreateMarineDto, @CurrentUser() user: JwtPayload) {
    return this.marinesService.create({
      ownerId: user.sub,
      name: dto.name,
      rank: dto.rank,
      chapter: dto.chapter,
      stats: dto.stats,
      squadId: dto.squadId,
      wargear: dto.wargear,
    });
  }
  @Get()
  findAll(
    @Query() query: FindMarinesQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const { rank, squadId, chapter, page, limit } = query;
    return this.marinesService.findAll({
      ownerId: user.sub,
      rank,
      squadId,
      chapter,
      page,
      limit,
    });
  }
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.marinesService.findById({ id, ownerId: user.sub });
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMarineDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.marinesService.update({
      ownerId: user.sub,
      id,
      name: dto.name,
      rank: dto.rank,
      squadId: dto.squadId,
      chapter: dto.chapter,
      stats: dto.stats,
      wargear: dto.wargear,
    });
  }
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.marinesService.remove({ ownerId: user.sub, id });
  }
}
